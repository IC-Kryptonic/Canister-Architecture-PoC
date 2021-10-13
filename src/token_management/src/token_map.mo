import Array "mo:base/Array";
import Blob "mo:base/Blob";
import Debug "mo:base/Debug";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import List "mo:base/List";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Text "mo:base/Text";

import ExchangeMaps "./exchange_util/Exchange_Maps";
import Types "./types/Types";
import VideoToken "./tokens/video_token";

actor TokenMap {

  type Token = VideoToken.video_token;
  type TokenAsRecord = Types.TokenAsRecord;
  type Ownership = Types.Ownership;
  type TokenInput = Types.TokenInput;

  let tokenMap = HashMap.HashMap<Text, Token>(0, Text.equal, Text.hash);
  let tokenOwners = HashMap.HashMap<Principal, [Ownership]>(0, Principal.equal, Principal.hash);

  public shared(msg) func createToken(input: TokenInput) : async() {
    let ownerPrincipal = Principal.fromText(input.owner);
    let newToken = await VideoToken.video_token(input.name, input.symbol, input.supply, ownerPrincipal, input.metadata);
    let canisterId = Principal.toText(Principal.fromActor(newToken));

    tokenMap.put(canisterId, newToken);

    let newOwnership = {
      tokenId = canisterId;
      ownedAmount = input.supply;
    };
    switch(tokenOwners.get(ownerPrincipal)) {
      case null {
        tokenOwners.put(ownerPrincipal, [newOwnership]);
      };
      case (?ownerships) {
        tokenOwners.put(ownerPrincipal, Array.append(ownerships, [newOwnership]));
      };
    };
    Debug.print("Token <" # input.name # "> was created successfully");
  };

  public shared(msg) func getAllTokens() : async [TokenAsRecord] {
    var result: [TokenAsRecord] = [];
    for(token in tokenMap.entries()) {
        let tokenAsRecord = await _parseToken(token.1, 0);
        result := Array.append(result, [tokenAsRecord]);        
      };
    return result;
  };

  public shared(msg) func getOwnedTokens(holder: Text) : async [TokenAsRecord] {
    let holderPrincipal = Principal.fromText(holder);
    var result: [TokenAsRecord] = [];
    switch(tokenOwners.get(holderPrincipal)) {
      case null {};
      case (?ownerships) {
        for(ownership in ownerships.vals()) {
          switch(tokenMap.get(ownership.tokenId)) {
            case null {};
            case (?token) {
              let tokenAsRecord = await _parseToken(token, ownership.ownedAmount);
              result := Array.append(result, [tokenAsRecord]);    
            };
          };
        };    
      };
    };
    return result;
  };

  public shared(msg) func changeOwnership(holderPrincipal: Principal, tokenId: Text, delta: Int): async () {
    switch(tokenOwners.get(holderPrincipal)) {
      case null {
        tokenOwners.put(holderPrincipal, [{
            tokenId = tokenId;
            ownedAmount = delta;
        }]);
      };
      case (?ownerships) {
        let matchingOwnerships = Array.filter<Ownership>(ownerships, func(item: Ownership) : Bool { item.tokenId == tokenId });
        let remainingItems = Array.filter<Ownership>(ownerships, func(item: Ownership) : Bool { item.tokenId != tokenId });
        if(matchingOwnerships.size() == 1) {
            let ownership = matchingOwnerships[0];
            let newAmount = ownership.ownedAmount + delta;
            if(newAmount < 1) {
              tokenOwners.put(holderPrincipal, remainingItems);
            } else {
              let newItem = {
                tokenId = tokenId;
                ownedAmount = newAmount;
              };
              tokenOwners.put(holderPrincipal, Array.append(remainingItems, [newItem]));
            };
            return;
        } else if (matchingOwnerships.size() == 0 and delta > 0) {
          tokenOwners.put(holderPrincipal, Array.append(remainingItems, [{
            tokenId = tokenId;
            ownedAmount = delta;
          }]));
        };
      };
    }; 
  };

  public shared(msg) func getTokenCount(): async Nat {
    return tokenMap.size();
  };

  // internal function
  func _parseToken(token: Token, ownedAmount: Int): async TokenAsRecord {
    let tokenId = Principal.toText(Principal.fromActor(token));
    var tokenName = "undefined";
    var tokenSymbol = "undefined";
    var tokenSupply = 0;
    var tokenMetadata = "undefined";

    let metadataResult = await token.metadata("");
    switch(metadataResult) {
      case (#err(error)) { 
        switch(error) {
          case(#InvalidToken(token)) {Debug.print("Invalid token")};
          case(#Other(error)) {Debug.print("Other error")};
        }
      };
      case (#ok(metadata)) {
        switch(metadata) {
          case(#fungible(data)) {
            tokenName := data.name;
            tokenSymbol := data.symbol;
            tokenMetadata := data.metadata;
          };
          case(#nonfungible(data)) {Debug.print("Non fungible")};
        }
      };
    };

    let supply = await token.supply("");
    switch(supply) {
      case (#err(error)) { 
        switch(error) {
          case(#InvalidToken(token)) {Debug.print("Invalid token")};
          case(#Other(error)) {Debug.print("Other error")};
        }
      };
      case (#ok(balance)) {
        tokenSupply := balance;
      }
    };

    return {
      canisterId = tokenId;
      name = tokenName;
      symbol = tokenSymbol;
      supply = tokenSupply;
      metadata = tokenMetadata;
      ownedAmount = ownedAmount;
    };
  };
};