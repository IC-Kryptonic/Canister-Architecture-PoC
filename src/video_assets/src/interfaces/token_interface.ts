export interface VideoToken {
  canisterId: string;
  storageCanisterId: string;
  name: string;
  creator: string;
  thumbnail: string;
  marketCap: string;
  sharePrice: string;
  viewsLastWeek: string;
  revenueLastWeek: string;
  priceChangeLastWeek: string;
  supply: number;
  ownedAmount: number;
}

export interface VideoTokenResult {
  canisterId: string;
  storageCanisterId: string;
  metadata: string;
  name: string;
  supply: BigInt;
  ownedAmount: BigInt;
  symbol: string;
}

export interface VideoTokenOffer {
  from: string;
  token: string;
  tokenName: string;
  canisterId: string;
  storageCanisterId: string;
  pricePerShare: number;
  shareAmount: number;
  offerTimeStamp: string;
}

export interface OffersByToken {
  tokenName: string;
  canisterId: string;
  storageCanisterId: string;
  minPrice: number;
  maxPrice: number;
  offeredAmount: number;
  offers: Array<VideoTokenOffer>;
}
