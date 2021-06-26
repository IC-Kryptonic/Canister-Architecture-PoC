import React, { useState } from 'react';
import { AuthContext } from './AuthContext';

const AuthContextState = (props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

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
