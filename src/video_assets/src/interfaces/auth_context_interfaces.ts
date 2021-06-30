import { Identity } from '@dfinity/agent';

export interface AuthContextProperties {
  isLoading: boolean;
  isAuthenticated: boolean;
  setIsAuthenticated: (input: boolean) => void;
  setIsLoading: (input: boolean) => void;
  identity: Identity | null;
}
