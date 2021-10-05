import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import {
  checkForExistingAuthentication,
  getAuthenticatedIdentity,
} from '../services/auth_services';
import { Identity } from '@dfinity/agent';

interface AuthContextStateProps {
  children: Array<React.ReactElement> | React.ReactElement;
}

const AuthContextState = (props: AuthContextStateProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [identity, setIdentity] = useState<Identity | null>(null);

  useEffect(() => {
    async function checkAuth() {
      setIsLoading(true);
      try {
        const isAuthenticatedNow = await checkForExistingAuthentication();
        if (isAuthenticatedNow !== isAuthenticated) {
          setIsAuthenticated(isAuthenticatedNow);
        }
      } catch (error) {
        console.error('Error checking for authentication', error);
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, []);

  useEffect(() => {
    async function getIdentity() {
      try {
        const authenticatedIdentity = await getAuthenticatedIdentity();
        console.debug('Setting identity to ', authenticatedIdentity.getPrincipal().toString());
        setIdentity(authenticatedIdentity);
      } catch (error) {
        console.error('Error retrieving identity for authenticated user', error);
      }
    }

    if (isAuthenticated && !identity) getIdentity();
    //else if (!isAuthenticated && identity) setIdentity(null);

  }, [isAuthenticated]);

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        setIsLoading,
        isAuthenticated,
        setIsAuthenticated,
        identity,
        setIdentity,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthContextState };
