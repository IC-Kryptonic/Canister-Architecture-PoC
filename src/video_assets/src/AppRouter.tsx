import React from 'react';
import { Redirect, Router, Switch, Route } from 'react-router-dom';
import History from './components/History';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthContextState } from './contexts/AuthContextState';
import Auth from './pages/Auth';
import Feed from './pages/Feed';
import Upload from './pages/Upload';
import ProfilePage from './pages/ProfilePage';
import WatchVideo from './pages/WatchVideo';
import MarketplaceHome from './pages/marketplace/MarketplaceHome';

export const AppRouter = () => {
  return (
    <AuthContextState>
      <Router history={History}>
        <Switch>
          <ProtectedRoute exact path="/upload" component={Upload} />
          <ProtectedRoute exact path="/feed" component={Feed} />
          <ProtectedRoute exact path="/video/:id" component={WatchVideo} />
          <ProtectedRoute exact path="/profile/:id" component={ProfilePage} />
          <ProtectedRoute exact path="/profile" component={ProfilePage} />
          <Route exact path="/marketplace" component={MarketplaceHome} />
          <Route exact path="/marketplace/markets" component={MarketplaceHome} />
          <Route exact path="/marketplace/dashboard" component={MarketplaceHome} />
          <Route exact path="/marketplace/buy" component={MarketplaceHome} />
          <Route exact path="/marketplace/sell" component={MarketplaceHome} />
          <Route exact path="/login" component={Auth} />
          <Redirect from="/" to="/feed" />
        </Switch>
      </Router>
    </AuthContextState>
  );
};
