import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { checkForExistingAuthentication } from '../services/auth_client';

const AuthContextState = (props) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    async function checkAuth() {
      setIsLoading(true);
      try {
        const isAuthenticatedNow = await checkForExistingAuthentication();
        if (isAuthenticatedNow !== isAuthenticated) {
          setIsAuthenticated(isAuthenticatedNow);
        }
      } catch (error) {
        console.log('Error checking for authentication', error);
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        setIsLoading,
        isAuthenticated,
        setIsAuthenticated,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthContextState };
