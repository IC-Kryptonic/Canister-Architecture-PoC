import React, { useState, useEffect, useContext } from 'react';
import { TokenContext } from './TokenContext';
import { AuthContext } from './AuthContext';
import { OffersByToken, VideoToken } from '../interfaces/token_interface';
import {
  getAllOffersByToken,
  getBalanceForIdentity,
  getTokensForCreator,
} from '../services/token_services';
import { Principal } from '@dfinity/principal';
import { loadVideo, loadVideoPost } from '../services/video_backend';
import { VideoMap } from '../interfaces/token_context_interfaces';

interface TokenContextStateProps {
  children: Array<React.ReactElement> | React.ReactElement;
}

const TokenContextState = (props: TokenContextStateProps) => {
  const { identity } = useContext(AuthContext);

  const [offersLoading, setOffersLoading] = useState<boolean>(false);
  const [dashboardLoading, setDashboardLoading] = useState<boolean>(false);
  const [tokenOffers, setTokenOffers] = useState<Array<OffersByToken>>([]);
  const [videoTokensForCreator, setVideoTokensForCreator] = useState<Array<VideoToken>>([]);
  const [tokenTrigger, setTokenTrigger] = useState<boolean>(true);
  const [nativeTokenBalance, setNativeTokenBalance] = useState<null | Number>(null);
  const [balanceTrigger, setBalanceTrigger] = useState<boolean>(true);
  const [videoMap, setVideoMap] = useState<VideoMap>({
    timestamp: '',
    map: new Map<string, string>(),
  });
  const [videoMapTrigger, setVideoMapTrigger] = useState<boolean>(false);

  useEffect(() => {
    async function queryBalance() {
      try {
        const balanceForIdentity = await getBalanceForIdentity(identity);
        setNativeTokenBalance(balanceForIdentity);
        setBalanceTrigger(false);
      } catch (error) {
        console.error('Error retrieving identity for authenticated user', error);
      }
    }
    if (identity && balanceTrigger) {
      queryBalance();
    }
  }, [identity, balanceTrigger]);

  useEffect(() => {
    async function queryOffersAndTokens() {
      setOffersLoading(true);
      setDashboardLoading(true);
      try {
        const tokenOffersResult = await getAllOffersByToken(identity);
        setTokenOffers(tokenOffersResult);
        setOffersLoading(false);
        const videoTokensForCreatorResult = await getTokensForCreator(identity);
        setVideoTokensForCreator(videoTokensForCreatorResult);
        setDashboardLoading(false);
        setVideoMapTrigger(true);
      } catch (error) {
        console.error('error fetching video tokens', error);
      } finally {
        if (offersLoading) setOffersLoading(false);
        if (dashboardLoading) setDashboardLoading(false);
        if (tokenTrigger) setTokenTrigger(false);
      }
    }

    if (identity) {
      queryOffersAndTokens();
    }
  }, [identity, tokenTrigger]);

  useEffect(() => {
    async function queryVideosForDashboard() {
      const storageIds = [];
      for (let token of videoTokensForCreator) storageIds.push(token.storageCanisterId);
      for (let token of tokenOffers) storageIds.push(token.storageCanisterId);
      for (let storageId of storageIds) {
        const existingVideo = videoMap.map.has(storageId);
        if (existingVideo) {
          return;
        }
        const videoPrincipal = Principal.fromText(storageId);
        const loadedVideoInfo = (await loadVideoPost(videoPrincipal));
        const loadedVideo = await loadVideo(loadedVideoInfo);
        videoMap.map.set(storageId, loadedVideo);
        // required to trigger state event handlers
        setVideoMap({
          timestamp: Date.now().toString(),
          map: videoMap.map,
        });
      }
    }
    if (identity && videoMapTrigger) {
      queryVideosForDashboard();
    }
  }, [videoMapTrigger]);

  return (
    <TokenContext.Provider
      value={{
        setTokenTrigger,
        setBalanceTrigger,
        dashboardLoading,
        offersLoading,
        tokenOffers,
        setTokenOffers,
        videoTokensForCreator,
        setVideoTokensForCreator,
        nativeTokenBalance,
        setNativeTokenBalance,
        videoMap,
      }}
    >
      {props.children}
    </TokenContext.Provider>
  );
};

export { TokenContextState };
