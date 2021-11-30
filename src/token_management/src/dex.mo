import HashMap "mo:base/HashMap";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Time "mo:base/Time";

import Exchange "./exchange_util/Exchange";
import ExchangeMaps "./exchange_util/Exchange_Maps";
import ExtAllowance "./tokens/ext/Allowance";
import ExtCore "./tokens/ext/Core";
import Match "./exchange_util/Match";
import Types "./types/Types";
import Validity "./exchange_util/Validity";

// Exchanges video shares for native tokens
// "from" is the user that offers video shares
// "to" is the user that exchanges native tokens for the video shares 
actor class DecentralizedExchange(_nativeTokenCanisterId: Text) = this {

  type AllowanceBalance = Types.AllowanceBalance;
  type Exchange = Types.Exchange;
  type ExchangeError = Types.ExchangeError;
  type TokenActor = Types.TokenActor;
  type ExchangeInput = Types.ExchangeInput;


  // stores executed exchanges
  let offerMap = HashMap.HashMap<Principal, HashMap.HashMap<Nat, Exchange>>(0, ExchangeMaps.isEqPrinc, Principal.hash);

  // stores executed exchanges
  let exchangeMap = HashMap.HashMap<Principal, HashMap.HashMap<Nat, Exchange>>(0, ExchangeMaps.isEqPrinc, Principal.hash);

  // native token actor
  let nativeToken = actor(_nativeTokenCanisterId) : TokenActor;

  // TODO change back to msg.caller instead of caller as argument
  public shared(msg) func createOffer(
    caller: Principal, tokenId: Text, tokenName: Text, pricePerShare: Nat, shareAmount: Nat, storageCanisterId: Text
  ): async Result.Result<(), ExchangeError> {
    let videoTokenActor = actor(tokenId) : TokenActor;
    let canisterPrincipal = await _getThisPrincipal();
    
    // create offer object
    let newOffer: Exchange = {
      from = caller;
      token = videoTokenActor;
      tokenName = tokenName;
      canisterId = tokenId;
      storageCanisterId = storageCanisterId;
      pricePerShare = pricePerShare;
      shareAmount = shareAmount;
      offerTimeStamp = Time.now();
      to = null;
      fulfillmentTimeStamp = null;
    };

    // check if user owns enough tokens and has allowed the dex canister to trade them 
    var curAllowanceBalance : AllowanceBalance = {allowance = 0; balance = 0;};
    switch(await Validity.checkAllowanceAndBalance(
      videoTokenActor, caller, canisterPrincipal, shareAmount
    )) {
      case (#ok(allowanceBalance)) {
        curAllowanceBalance := allowanceBalance;
      };
      case (#err(err)) {
        return #err(err);
      };
    };

    var existingOffers = offerMap.get(caller);
    switch(existingOffers) {
      case null {
        let newMap = HashMap.HashMap<Nat, Exchange>(0, ExchangeMaps.isEqNat, ExchangeMaps.natToHash);
        newMap.put(0, newOffer);
        offerMap.put(caller, newMap);
      };
      case (?offersForPrincipal) {
        // check that new offer is valid considering existing offers
        var curOfferedAmount = 0;
        for (offer in offersForPrincipal.entries()) {
          if(
            offer.1.token == videoTokenActor and 
            offer.1.from == caller
          ) {
            curOfferedAmount += offer.1.shareAmount;
          };
        };
        if(curOfferedAmount + shareAmount > curAllowanceBalance.balance) {
          return #err(#InsufficientBalance(curAllowanceBalance.balance));
        };
        if(curOfferedAmount + shareAmount > curAllowanceBalance.allowance) {
          return #err(#InsufficientAllowance(curAllowanceBalance.allowance));
        };
        offersForPrincipal.put(offersForPrincipal.size(), newOffer);
        offerMap.put(caller, offersForPrincipal);
      };
    };
    return #ok();
  };
  
  public shared (msg) func realizeExchange(input: ExchangeInput): async Result.Result<(), ExchangeError> {
    let videoTokenActor = actor(input.tokenId) : TokenActor;
    let dexPrincipal = await _getThisPrincipal();
    var totalShares = 0;
    var totalPrice = 0;

    // check if video share owner has enough tokens and has allowed the dex canister to trade them 
    for(exchangeRequest in input.requestedExchanges.vals()) {
      switch(await Validity.checkAllowanceAndBalance(
        videoTokenActor, exchangeRequest.currentTokenHolder, dexPrincipal, exchangeRequest.exchangeShareAmount
      )) {
        case (#ok(allowanceBalance)) {
          totalShares += exchangeRequest.exchangeShareAmount;
          totalPrice += exchangeRequest.exchangeShareAmount * exchangeRequest.pricePerShare;
        };
        case (#err(err)) {
          return #err(err);
        };
      };
    };

    // check if video share buyer has enough native tokens and has allowed the dex canister to trade them 
    switch(await Validity.checkAllowanceAndBalance(
      nativeToken, input.caller, dexPrincipal, totalPrice
    )) {
      case (#ok(allowanceBalance)) {};
      case (#err(err)) {
        return #err(err);
      };
    };

    // realize exchanges
    for(exchangeRequest in input.requestedExchanges.vals()) {
      switch(offerMap.get(exchangeRequest.currentTokenHolder)) {
        case null {
          return #err(#NoExistingOffersFrom(exchangeRequest.currentTokenHolder));
        };
        case (?offers) {
          if(offers.size() == 0) {
            return #err(#NoExistingOffersFrom(exchangeRequest.currentTokenHolder));
          };
          // find matching offer regarding price and amount of video shares
          switch(
            Match.findMatchingOffer(
              offerMap, 
              exchangeRequest.currentTokenHolder, 
              videoTokenActor, 
              exchangeRequest.pricePerShare, 
              exchangeRequest.offerShareAmount, 
              exchangeRequest.exchangeShareAmount
            )
          ) {
            case null {
              return #err(#NoMatchingOffers());
            };
            case (?offer) {
              // exchange native tokens and video shares
              switch(
                await Exchange.exchangeTokens(
                  nativeToken, 
                  videoTokenActor, 
                  exchangeRequest.currentTokenHolder, 
                  input.caller, 
                  exchangeRequest.pricePerShare, 
                  exchangeRequest.exchangeShareAmount
                )
              ){
                case (#ok(balance)) {};
                case (#err(err)) {
                  return #err(#TransferError());
                };
              };

              // remove offer from offerMap
              switch(offers.remove(offer.0)) {
                case null {
                  return #err(#InternalError("error removing entry from offer map"));
                };
                case (?usedOffer) {
                  let newExchange = {
                    from = usedOffer.from;
                    token = usedOffer.token;
                    tokenName = usedOffer.tokenName;
                    canisterId = input.tokenId;
                    storageCanisterId = usedOffer.storageCanisterId;
                    pricePerShare = usedOffer.pricePerShare;
                    shareAmount = exchangeRequest.exchangeShareAmount;
                    offerTimeStamp = usedOffer.offerTimeStamp;
                    to = ?input.caller;
                    fulfillmentTimeStamp = ?Time.now();
                  };
                  // if purchased amount is smaller than offer amount, put rest of offer back in the map
                  if(exchangeRequest.exchangeShareAmount < usedOffer.shareAmount) {
                    let remainingOffer = {
                      from = usedOffer.from;
                      token = usedOffer.token;
                      tokenName = usedOffer.tokenName;
                      canisterId = input.tokenId;
                      storageCanisterId = usedOffer.storageCanisterId;
                      pricePerShare = usedOffer.pricePerShare;
                      shareAmount = usedOffer.shareAmount - exchangeRequest.exchangeShareAmount;
                      offerTimeStamp = usedOffer.offerTimeStamp;
                      to = null;
                      fulfillmentTimeStamp = null;
                    };
                    offers.put(offers.size(), remainingOffer);
                  };
                  // add completed exchange to exchange map
                  switch(exchangeMap.get(input.caller)) {
                    case null {
                      let newMap = HashMap.HashMap<Nat, Exchange>(0, ExchangeMaps.isEqNat, ExchangeMaps.natToHash);
                      newMap.put(0, newExchange);
                      exchangeMap.put(input.caller, newMap);
                    };
                    case (?exchangesForPrincipal) {
                      exchangesForPrincipal.put(exchangesForPrincipal.size(), newExchange);
                      exchangeMap.put(input.caller, exchangesForPrincipal);
                    };
                  };
                };
              };
            }; 
          };
        };
      };
    };
    return #ok();
  };

  public shared(msg) func getOffersForUser(user: Principal): async [Exchange] {
    return await ExchangeMaps.getMapForUser(offerMap, user);
  };

  public func getAllOffers() : async [Exchange] { return await ExchangeMaps.getAll(offerMap); };

  public shared(msg) func getExchangesForUser(user: Principal): async [Exchange] {
    return await ExchangeMaps.getMapForUser(exchangeMap, user);
  };

  public func getAllExchanges() : async [Exchange] { return await ExchangeMaps.getAll(exchangeMap); };

  func _getThisPrincipal(): async Principal {
    return Principal.fromActor(this);
  };
};