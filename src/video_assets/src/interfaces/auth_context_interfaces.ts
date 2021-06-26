export interface AuthContextProperties {
  isLoading: boolean;
  isAuthenticated: boolean;
  setIsAuthenticated: (input: boolean) => void;
  setIsLoading: (input: boolean) => void;
}
