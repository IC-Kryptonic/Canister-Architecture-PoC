import React, { useContext } from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const ProtectedRoute = ({ component: Component, ...rest }: RouteProps) => {
  const { isLoading, isAuthenticated } = useContext(AuthContext);

  if (isLoading) {
    return <>Authenzifizierung läuft...</>;
  }
  if (isAuthenticated) {
    return (
      <Route {...rest} render={(matchProps) => <Component {...matchProps} />} />
    );
  }
  return <Redirect to="/login" />;
};

export default ProtectedRoute;
