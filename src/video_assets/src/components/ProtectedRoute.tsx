import React, { useContext, useEffect } from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const ProtectedRoute = ({ component: Component, ...rest }: RouteProps) => {
  const { isLoading, isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [rest.location]);

  if (isLoading) {
    return <>Authenzifizierung läuft...</>;
  }
  if (isAuthenticated) {
    return <Route {...rest} render={(matchProps) => <Component {...matchProps} />} />;
  }
  return <Redirect to="/login" />;
};

export default ProtectedRoute;
