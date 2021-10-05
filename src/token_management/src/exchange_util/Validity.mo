import Debug "mo:base/Debug";
import Result "mo:base/Result";

import ExtAllowance "../tokens/ext/Allowance";
import ExtCore "../tokens/ext/Core";
import Types "../types/Types";

module Validity {
  type TokenActor = Types.TokenActor;
  type AllowanceBalance = Types.AllowanceBalance;
  type ExchangeError = Types.ExchangeError;
  
  public func checkAllowanceAndBalance(
    token: TokenActor, owner: Principal, spender: Principal, shareAmount: Nat
  ) : async Result.Result<AllowanceBalance, ExchangeError>{
    var curAllowance = 0;
    var curBalance = 0;
    switch(await token.checkAllowance(
      owner,
      spender
    )) {
      case (#ok(allowance)) {
        if(allowance < shareAmount) {
          return #err(#InsufficientAllowance(allowance)); 
        };
        curAllowance := allowance;
      };
      case (_) {
        return #err(#InsufficientAllowance(0));
      };
    };
    switch(await token.balance({
      user = #principal(owner);
      token = "";
    })) {
      case (#ok(balance)) {
        if(balance < shareAmount) {
          return #err(#InsufficientBalance(balance)); 
        };
        curBalance := balance;
      };
      case (_) {
        return #err(#InsufficientBalance(0));
      };
    };
    return #ok({allowance = curAllowance; balance = curBalance;});
  };
};