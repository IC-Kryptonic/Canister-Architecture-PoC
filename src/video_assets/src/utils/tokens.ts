import { Identity } from '@dfinity/agent';
import {
  ExchangeInput,
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
    entry = parseBigInts(entry);
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
      existingOffers.offers.sort((a, b) =>
        a.pricePerShare > b.pricePerShare ? 1 : b.pricePerShare > a.pricePerShare ? -1 : 0
      );
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

function parseBigInts(entry: VideoTokenOffer): VideoTokenOffer {
  entry.pricePerShare = Number(entry.pricePerShare);
  entry.shareAmount = Number(entry.shareAmount);
  return entry;
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

// function expects offers param to be ordered by price
export function selectOffers(
  identity: Identity,
  offersByToken: OffersByToken,
  amount: number
): ExchangeInput {
  let totalPrice = 0;
  let curAmount = 0;
  const caller = identity.getPrincipal();
  const exchangeInput: ExchangeInput = {
    totalPrice,
    caller,
    tokenId: offersByToken.canisterId,
    requestedExchanges: [],
  };

  for (let offer of offersByToken.offers) {
    let missingAmount = amount - curAmount;
    if (missingAmount > offer.shareAmount) {
      exchangeInput.requestedExchanges.push({
        currentTokenHolder: offer.from,
        pricePerShare: offer.pricePerShare,
        offerShareAmount: offer.shareAmount,
        exchangeShareAmount: offer.shareAmount,
      });
      totalPrice += offer.pricePerShare * offer.shareAmount;
      curAmount += offer.shareAmount;
    } else if (missingAmount <= offer.shareAmount) {
      exchangeInput.requestedExchanges.push({
        currentTokenHolder: offer.from,
        pricePerShare: offer.pricePerShare,
        offerShareAmount: offer.shareAmount,
        exchangeShareAmount: missingAmount,
      });
      totalPrice += offer.pricePerShare * missingAmount;
      exchangeInput.totalPrice = addDecimalPlace(totalPrice);
      return exchangeInput;
    }
  }
  throw new Error('Error finding fitting offers for requested token amount');
}
