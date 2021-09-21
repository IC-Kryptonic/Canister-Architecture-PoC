import React, { useState, useEffect, useContext } from 'react';
import { TokenContext } from './TokenContext';
import { AuthContext } from './AuthContext';
import { VideoToken } from '../interfaces/token_interface';
import {
  getAllTokens,
  getBalanceForIdentity,
  getTokensForCreator,
} from '../services/token_services';

interface TokenContextStateProps {
  children: Array<React.ReactElement> | React.ReactElement;
}

const TokenContextState = (props: TokenContextStateProps) => {
  const { identity } = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [videoTokens, setVideoTokens] = useState<Array<VideoToken>>([]);
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
    async function queryTokens() {
      setIsLoading(true);
      try {
        const videoTokensResult = await getAllTokens(identity);
        setVideoTokens(videoTokensResult);
        const videoTokensForCreatorResult = await getTokensForCreator(identity);
        setVideoTokensForCreator(videoTokensForCreatorResult);
      } catch (error) {
        console.error('error fetching video tokens');
      } finally {
        setIsLoading(false);
      }
    }

    if (identity) {
      queryTokens();
    }
  }, [identity]);

  return (
    <TokenContext.Provider
      value={{
        setBalanceTrigger,
        isLoading,
        setIsLoading,
        videoTokens,
        setVideoTokens,
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
