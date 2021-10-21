import Types "../types/Types";

module Match {
  type Exchange = Types.Exchange;
  type ExchangeMap = Types.ExchangeMap;
  type TokenActor = Types.TokenActor;

  public func findMatchingOffer(
    offerMap: ExchangeMap, owner: Principal, token: TokenActor, pricePerShare: Nat, offerAmount: Nat, shareAmount: Nat
  ): ?(Nat, Exchange) {
    if(shareAmount > offerAmount) return null;
    let offers = offerMap.get(owner);
    switch(offers) {
      case null {
        return null;
      };
      case (?offers) {
        if(offers.size() == 0) return null;
        for (offer in offers.entries()) {
          if(
            offer.1.token == token and 
            offer.1.pricePerShare == pricePerShare and
            offer.1.shareAmount == offerAmount
          ) {
            return ?(offer.0, offer.1);
          };
        };
      };
    };
    return null;
  };
};