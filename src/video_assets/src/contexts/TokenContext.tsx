import { createContext } from 'react';
import { TokenContextProperties } from '../interfaces/token_context_interfaces';

//these default values are never used, they're just making typescript happy

export const TokenContext = createContext<TokenContextProperties>({
  offersLoading: false,
  dashboardLoading: false,
  tokenOffers: [],
  setTokenOffers: () => {},
  videoTokensForCreator: [],
  setVideoTokensForCreator: () => {},
  nativeTokenBalance: 0,
  setNativeTokenBalance: () => {},
  setBalanceTrigger: () => {},
  setTokenTrigger: () => {},
  showValuesInIcp: false,
  setShowValuesInIcp: () => {},
  videoMap: { timestamp: '', map: new Map() },
});
