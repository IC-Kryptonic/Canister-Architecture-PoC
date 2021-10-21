import { Identity } from '@dfinity/agent';
import {
  OffersByToken,
  VideoToken,
  VideoTokenOffer,
  VideoTokenResult,
} from '../interfaces/token_interface';

export const nativeTokenDecimals = 4;

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

export function parseOffers(
  result: Array<VideoTokenOffer>,
  identity: Identity
): Array<OffersByToken> {
  const offerMap = new Map<string, OffersByToken>();
  const caller = identity.getPrincipal().toString();
  for (let entry of result) {
    const offerer = entry.from.toString();
    // ignore offers from caller
    if (offerer === caller) continue;
    const tokenAsString = entry.token.toString();
    if (offerMap.has(tokenAsString)) {
      const existingOffers = offerMap.get(tokenAsString);
      if (existingOffers.minPrice > entry.pricePerShare) {
        existingOffers.minPrice = entry.pricePerShare;
      }
      if (existingOffers.maxPrice < entry.pricePerShare) {
        existingOffers.maxPrice = entry.pricePerShare;
      }
      existingOffers.offeredAmount += entry.shareAmount;
      existingOffers.offers.push(entry);
      offerMap.set(tokenAsString, existingOffers);
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
      offerMap.set(tokenAsString, newTokenOffers);
    }
  }
  const parsedResult: Array<OffersByToken> = [];
  for (let entry of offerMap.entries()) {
    entry[1].maxPrice = addDecimalPlace(Number(entry[1].maxPrice));
    entry[1].minPrice = addDecimalPlace(Number(entry[1].minPrice));
    parsedResult.push(entry[1]);
  }
  parsedResult.sort((a, b) => (a.tokenName > b.tokenName ? 1 : b.tokenName > a.tokenName ? -1 : 0));
  return parsedResult;
}

export function removeDecimalPlace(amount: number) {
  return amount * Math.pow(10, nativeTokenDecimals);
}

export function addDecimalPlace(amount: number) {
  return amount / Math.pow(10, nativeTokenDecimals);
}

export function countDecimals(value: number): number {
  if (value % 1 != 0) return value.toString().split('.')[1].length;
  return 0;
}
