import {
  OffersByToken,
  VideoToken,
  VideoTokenOffer,
  VideoTokenResult,
} from '../interfaces/token_interface';

export function parseTokenResult(result: Array<VideoTokenResult>): Array<VideoToken> {
  const parsedResult: Array<VideoToken> = [];
  for (let entry of result) {
    const metadata = JSON.parse(entry.metadata);
    parsedResult.push({
      name: entry.name,
      canisterId: entry.canisterId,
      ownedAmount: entry.ownedAmount,
      supply: entry.supply,
      ...metadata,
    });
  }
  return parsedResult;
}

export function parseOffers(result: Array<VideoTokenOffer>): Array<OffersByToken> {
  const offerMap = new Map<string, OffersByToken>();
  for (let entry of result) {
    if (offerMap.has(entry.token)) {
      const existingOffers = offerMap.get(entry.token);
      if (existingOffers.minPrice > entry.pricePerShare) {
        existingOffers.minPrice = entry.pricePerShare;
      }
      if (existingOffers.maxPrice < entry.pricePerShare) {
        existingOffers.maxPrice = entry.pricePerShare;
      }
      existingOffers.offeredAmount += entry.shareAmount;
      existingOffers.offers.push(entry);
      offerMap.set(entry.token, existingOffers);
    } else {
      const newTokenOffers: OffersByToken = {
        minPrice: entry.pricePerShare,
        maxPrice: entry.pricePerShare,
        offeredAmount: entry.shareAmount,
        offers: [entry],
        tokenName: entry.tokenName,
        canisterId: entry.canisterId,
        storageCanisterId: entry.storageCanisterId,
      };
      offerMap.set(entry.token, newTokenOffers);
    }
  }
  const parsedResult: Array<OffersByToken> = [];
  for (let entry of offerMap.entries()) {
    parsedResult.push(entry[1]);
  }
  return parsedResult;
}
