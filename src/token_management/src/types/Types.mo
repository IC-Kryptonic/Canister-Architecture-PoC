import HashMap "mo:base/HashMap";
import Result "mo:base/Result";
import Time "mo:base/Time";

import ExtAllowance "../tokens/ext/Allowance";
import ExtCore "../tokens/ext/Core";


module Types {
  public type ExchangeError = {
    #InsufficientBalance: Nat;
    #InsufficientAllowance: Nat;
    #NoExistingOffersFrom: Principal;
    #NoMatchingOffers: ();
    #InternalError : Text;
    #TransferError: ();
  };

  public type TokenActor = actor {
    checkAllowance: (owner: Principal, spender: Principal) -> async Result.Result<Nat, ExtCore.CommonError>;
    approve: (request: ExtAllowance.ApproveRequest) -> async ();
    balance: (request : ExtCore.BalanceRequest) -> async ExtCore.BalanceResponse;
    transfer: (request: ExtCore.TransferRequest) -> async ExtCore.TransferResponse;
  };

  public type TokenAsRecord = {
    canisterId: Text;
    name: Text;
    symbol: Text;
    supply: Nat;
    ownedAmount: Int;
    metadata: Text;
  };

  public type AllowanceBalance = {
    allowance: Nat;
    balance: Nat;
  };

  // when exchange is offer, "to" and "fulfillmentTimeStamp" are null
  // when exchange is realized, the properties are set
  public type Exchange = {
      from: Principal;
      token: TokenActor;
      canisterId: Text;
      storageCanisterId: Text;
      tokenName: Text;
      pricePerShare: Nat;
      shareAmount: Nat;
      offerTimeStamp: Time.Time;
      to: ?Principal;
      fulfillmentTimeStamp: ?Time.Time; 
  };

  public type ExchangeMap = HashMap.HashMap<Principal, HashMap.HashMap<Nat, Exchange>>;

  public type Ownership = {
    tokenId: Text;
    ownedAmount: Int;
  };

  public type TokenInput = {
    owner: Text;
    name: Text;
    symbol: Text;
    supply: Nat;
    storageCanisterId: Text;
    metadata: Text;
  };

  public type ExchangeRequest = {
    currentTokenHolder: Principal;
    pricePerShare: Nat;
    offerShareAmount: Nat;
    exchangeShareAmount: Nat;
  };

  public type ExchangeInput = {
    caller: Principal;
    tokenId: Text;
    requestedExchanges: [ExchangeRequest];
  };

  public type StorageActor = actor {
      set_owner: (token: Principal) -> async ();
    };
};

