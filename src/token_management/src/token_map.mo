import Array "mo:base/Array";
import Blob "mo:base/Blob";
import Debug "mo:base/Debug";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import List "mo:base/List";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";

import ExchangeMaps "./exchange_util/Exchange_Maps";
import Types "./types/Types";
import VideoToken "./tokens/video_token";

actor TokenMap {

  type Token = VideoToken.video_token;
  type TokenAsRecord = Types.TokenAsRecord;

  let tokenMap = HashMap.HashMap<Principal, HashMap.HashMap<Nat, Token>>(0, ExchangeMaps.isEqPrinc, Principal.hash);

  public shared(msg) func createToken(name: Text, symbol: Text, decimals: Nat8, supply: Nat, metadata: Text) : async() {
    let newToken = await VideoToken.video_token(name, symbol, decimals, supply, msg.caller, metadata);
    switch(tokenMap.get(msg.caller)) {
      case null {
        let newMap = HashMap.HashMap<Nat, Token>(0, ExchangeMaps.isEqNat, ExchangeMaps.natToHash);
        newMap.put(0, newToken);
        tokenMap.put(msg.caller, newMap);
      };
      case (?tokensFromPrincipal) {
        tokensFromPrincipal.put(tokensFromPrincipal.size(), newToken);
        tokenMap.put(msg.caller, tokensFromPrincipal);
      };
    };
    Debug.print("Token <" # name # "> was created successfully");
  };

  public shared(msg) func getAllTokens() : async [TokenAsRecord] {
    var result: [TokenAsRecord] = [];
    for (mapForPrincipal in tokenMap.entries()) {
      for(tokenForPrincipal in mapForPrincipal.1.entries()) {
        let tokenAsRecord = await _parseToken(tokenForPrincipal.1);
        result := Array.append(result, [tokenAsRecord]);        
      };
    };
    return result;
  };

  public shared(msg) func getTokensForCreator() : async [TokenAsRecord] {
    var result: [TokenAsRecord] = [];
    switch(tokenMap.get(msg.caller)) {
      case null {};
      case (?mapForPrincipal) {
        for(tokenForPrincipal in mapForPrincipal.entries()) {
          let tokenAsRecord = await _parseToken(tokenForPrincipal.1);
          result := Array.append(result, [tokenAsRecord]);    
        };    
      };
    };
    return result;
  };

  public shared(msg) func getTokenCount(): async Nat {
    return tokenMap.size();
  };

  // internal function
  func _parseToken(token: Token): async TokenAsRecord {
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
    };
  };
};