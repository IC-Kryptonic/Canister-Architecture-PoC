export interface VideoToken {
  canisterId: string;
  name: string;
  creator: string;
  thumbnail: string;
  marketCap: string;
  sharePrice: string;
  viewsLastWeek: string;
  revenueLastWeek: string;
  priceChangeLastWeek: string;
  link: string;
  supply: number;
  ownedShares?: Number;
}

export interface VideoTokenResult {
  canisterId: string;
  metadata: string;
  name: string;
  supply: BigInt;
  symbol: string;
}

export interface VideoTokenOffer {
  from: string;
  token: string;
  tokenName: string;
  canisterId: string;
  pricePerShare: number;
  shareAmount: number;
  offerTimeStamp: string;
}

export interface OffersByToken {
  tokenName: string;
  canisterId: string;
  minPrice: number;
  maxPrice: number;
  offeredAmount: number;
  offers: Array<VideoTokenOffer>;
}
