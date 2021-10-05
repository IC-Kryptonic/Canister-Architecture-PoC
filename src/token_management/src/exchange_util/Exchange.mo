import Debug "mo:base/Debug";
import Nat "mo:base/Nat";

import ExtAllowance "../tokens/ext/Allowance";
import ExtCore "../tokens/ext/Core";
import Types "../types/Types";

module Exchange {
  type TokenActor = Types.TokenActor;

  // TODO implement rollbacks when second transfer fails
  public func exchangeTokens(
    nativeToken: TokenActor, videoToken: TokenActor, shareHolder: Principal, shareBuyer: Principal, pricePerShare: Nat, shareAmount: Nat
  ) : async ExtCore.TransferResponse {
    // transfer native tokens 
    switch(await nativeToken.transfer({
      from = #principal(shareBuyer);
      to = #principal(shareHolder);
      token = "";
      amount = shareAmount * pricePerShare;
      memo = "";
      notify = false;
      subaccount = null;
    })){
      case (#ok(balance)) {
        Debug.print(Nat.toText(balance) # " native tokens were transfered successfully");
      };
      case (#err(err)) {
        return #err(err);
      };
    };
    
    // transfer video shares
    switch(await videoToken.transfer({
      from = #principal(shareHolder);
      to = #principal(shareBuyer);
      token = "";
      amount = shareAmount;
      memo = "";
      notify = false;
      subaccount = null;
    })){
      case (#ok(balance)) {
        Debug.print(Nat.toText(balance) # " video tokens were transfered successfully");
      };
      case (#err(err)) {
        return #err(err);
      };
    };
    return #ok(shareAmount);
  };
};