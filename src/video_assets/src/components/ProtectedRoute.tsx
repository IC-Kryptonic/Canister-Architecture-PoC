import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const ProtectedRoute = ({ component: Component, ...rest }: any) => {
  const { isLoading, isAuthenticated } = useContext(AuthContext);

  if (isLoading) {
    return <>Loading...</>;
  }
  if (isAuthenticated) {
    return (
      <Route {...rest} render={(matchProps) => <Component {...matchProps} />} />
    );
  }
  return <Redirect to="/login" />;
};

export default ProtectedRoute;
