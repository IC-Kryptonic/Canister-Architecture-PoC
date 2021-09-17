import React, { useContext } from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const MarketplaceProtectedRoute = ({ component: Component, ...rest }: RouteProps) => {
  const { isLoading, isAuthenticated } = useContext(AuthContext);

  if (isLoading) {
    return <>Authenticating...</>;
  }
  if (isAuthenticated) {
    return <Route {...rest} render={(matchProps) => <Component {...matchProps} />} />;
  }
  return <Redirect to="/marketplace/login" />;
};

export default MarketplaceProtectedRoute;
