import { createContext } from 'react';
import { AuthContextProperties } from '../interfaces/auth_context_interfaces';

//these default values are never used, they're just making typescript happy

export const AuthContext = createContext<AuthContextProperties>({
  isLoading: true,
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  setIsLoading: () => {},
  identity: null,
});
