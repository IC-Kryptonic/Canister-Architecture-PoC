import { createContext } from 'react';
import { TokenContextProperties } from '../interfaces/token_context_interfaces';

//these default values are never used, they're just making typescript happy

export const TokenContext = createContext<TokenContextProperties>({
  isLoading: true,
  setIsLoading: () => {},
  videoTokens: [],
  setVideoTokens: () => {},
  videoTokensForCreator: [],
  setVideoTokensForCreator: () => {},
  nativeTokenBalance: 0,
  setNativeTokenBalance: () => {},
  setBalanceTrigger: () => {}
});
