import React from 'react';
import { Redirect, Router, Switch, Route } from 'react-router-dom';
import History from './components/History';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthContextState } from './contexts/AuthContextState';
import Auth from './pages/Auth';
import Feed from './pages/Feed';
import Upload from './pages/Upload';
import Profile from './pages/Profile';
import ProfilePage from './pages/ProfilePage';

export const AppRouter = () => {
  return (
    <AuthContextState>
      <Router history={History}>
        <Switch>
          <ProtectedRoute exact path="/upload" component={Upload} />
          <ProtectedRoute exact path="/feed" component={Feed} />
          <ProtectedRoute exact path="/profile" component={ProfilePage} />
          <Route exact path="/login" component={Auth} />
          <Redirect from="/" to="/feed" />
        </Switch>
      </Router>
    </AuthContextState>
  );
};
