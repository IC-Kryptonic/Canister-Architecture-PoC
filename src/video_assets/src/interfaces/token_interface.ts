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
  availableShares: number;
  ownedShares: number;
}

export interface VideoTokenResult {
  canisterId: string;
  metadata: string;
  name: string;
  supply: BigInt;
  symbol: string;
}
