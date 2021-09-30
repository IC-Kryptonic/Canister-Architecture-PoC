import React, { useContext, useEffect } from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const MarketplaceProtectedRoute = ({ component: Component, ...rest }: RouteProps) => {
  const { isLoading, isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [rest.location]);

  if (isLoading) {
    return <>Authenticating...</>;
  }
  if (isAuthenticated) {
    return <Route {...rest} render={(matchProps) => <Component {...matchProps} />} />;
  }
  return <Redirect to="/marketplace/login" />;
};

export default MarketplaceProtectedRoute;
