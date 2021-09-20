import Array "mo:base/Array";
import Hash "mo:base/Hash";
import HashMap "mo:base/HashMap";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";

import Types "../types/Types";

module ExchangeMaps {
  type Exchange = Types.Exchange;

  // determine if two entries in exchangeMap are equal 
  public func isEqPrinc(x: Principal, y: Principal): Bool { x == y };
  public func isEqNat(x: Nat, y: Nat): Bool { x == y };

  // creates hash for nat
  public func natToHash(x: Nat): Hash.Hash { Hash.hash(x)};
  
  public func getMapForUser(map: HashMap.HashMap<Principal, HashMap.HashMap<Nat, Exchange>>, caller: Principal): async [Exchange] {
    switch(map.get(caller)) {
      case null {
        return [];
      };
      case (?map) {
        if(map.size() == 0) return [];
        var result: [Exchange] = [];
        for (offer in map.entries()) {
          result := Array.append(result, [offer.1]);
        };
        return result;
      };
    };
    return [];
  };

  public func getAll(map: HashMap.HashMap<Principal, HashMap.HashMap<Nat, Exchange>>): async [Exchange] {
    var result: [Exchange] = [];
    for (mapForPrincipal in map.entries()) {
      for(exchangeForPrincipal in mapForPrincipal.1.entries()) {
        result := Array.append(result, [exchangeForPrincipal.1]);        
      };
    };
    return result;
  };
};