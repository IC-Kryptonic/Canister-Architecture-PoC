import React, { useState, useEffect, useContext } from 'react';
import { TokenContext } from './TokenContext';
import { AuthContext } from './AuthContext';
import { OffersByToken, VideoToken } from '../interfaces/token_interface';
import {
  getAllOffersByToken,
  getAllTokens,
  getBalanceForIdentity,
  getShareBalanceForIdentity,
  getTokensForCreator,
} from '../services/token_services';

interface TokenContextStateProps {
  children: Array<React.ReactElement> | React.ReactElement;
}

const TokenContextState = (props: TokenContextStateProps) => {
  const { identity } = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tokenOffers, setTokenOffers] = useState<Array<OffersByToken>>([]);
  const [videoTokensForCreator, setVideoTokensForCreator] = useState<Array<VideoToken>>([]);
  const [nativeTokenBalance, setNativeTokenBalance] = useState<null | Number>(null);
  const [balanceTrigger, setBalanceTrigger] = useState<boolean>(true);

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
      setIsLoading(true);
      try {
        const tokenOffersResult = await getAllOffersByToken(identity);
        setTokenOffers(tokenOffersResult);
        const videoTokensForCreatorResult = await getTokensForCreator(identity);
        setVideoTokensForCreator(videoTokensForCreatorResult);
      } catch (error) {
        console.error('error fetching video tokens', error);
      } finally {
        setIsLoading(false);
      }
    }

    if (identity) {
      queryOffersAndTokens();
    }
  }, [identity]);

  return (
    <TokenContext.Provider
      value={{
        setBalanceTrigger,
        isLoading,
        setIsLoading,
        tokenOffers,
        setTokenOffers,
        videoTokensForCreator,
        setVideoTokensForCreator,
        nativeTokenBalance,
        setNativeTokenBalance,
      }}
    >
      {props.children}
    </TokenContext.Provider>
  );
};

export { TokenContextState };
