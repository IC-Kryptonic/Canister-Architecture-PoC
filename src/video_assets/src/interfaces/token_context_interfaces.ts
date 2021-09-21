import { VideoToken } from './token_interface';

export interface TokenContextProperties {
  isLoading: boolean;
  setIsLoading: (input: boolean) => void;
  videoTokens: Array<VideoToken>;
  setVideoTokens: (input: Array<VideoToken>) => void;
  videoTokensForCreator: Array<VideoToken>;
  setVideoTokensForCreator: (input: Array<VideoToken>) => void;
  nativeTokenBalance: Number | null;
  setNativeTokenBalance: (input: number) => void;
  setBalanceTrigger: (input: boolean) => void;
}
