import { OffersByToken, VideoToken } from './token_interface';

export interface VideoMap {
  timestamp: string;
  map: Map<string, string>;
}

export interface TokenContextProperties {
  isLoading: boolean;
  setIsLoading: (input: boolean) => void;
  tokenOffers: Array<OffersByToken>;
  setTokenOffers: (input: Array<OffersByToken>) => void;
  videoTokensForCreator: Array<VideoToken>;
  setVideoTokensForCreator: (input: Array<VideoToken>) => void;
  nativeTokenBalance: Number | null;
  setNativeTokenBalance: (input: number) => void;
  setBalanceTrigger: (input: boolean) => void;
  videoMap: VideoMap;
}
