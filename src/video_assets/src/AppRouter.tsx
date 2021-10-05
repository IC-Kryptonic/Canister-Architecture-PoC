import React from 'react';
import { Redirect, Router, Switch, Route } from 'react-router-dom';
import History from './components/History';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthContextState } from './contexts/AuthContextState';
import { TokenContextState } from './contexts/TokenContextState';
import Auth from './pages/Auth';
import Feed from './pages/Feed';
import Upload from './pages/Upload';
import ProfilePage from './pages/ProfilePage';
import WatchVideo from './pages/WatchVideo';
import MarketplaceHome from './pages/marketplace/MarketplaceHome';
import MarketplaceFaucet from './pages/marketplace/MarketplaceFaucet';
import MarketplaceSell from './pages/marketplace/MarketplaceSell';
import MarketplaceBuy from './pages/marketplace/MarketplaceBuy';
import MarketplaceDashboard from './pages/marketplace/MarketplaceDashboard';
import MarketplaceAuth from './pages/marketplace/MarketplaceAuth';

export const AppRouter = () => {
  return (
    <AuthContextState>
      <TokenContextState>
        <Router history={History}>
          <Switch>
            <ProtectedRoute exact path="/upload" component={Upload} />
            <ProtectedRoute exact path="/home" component={Feed} />
            <ProtectedRoute exact path="/video/:id" component={WatchVideo} />
            <ProtectedRoute exact path="/profile/:id" component={ProfilePage} />
            <ProtectedRoute exact path="/profile" component={ProfilePage} />
            <ProtectedRoute exact path="/marketplace/markets" component={MarketplaceHome} />
            <ProtectedRoute exact path="/marketplace/dashboard" component={MarketplaceDashboard} />
            <ProtectedRoute exact path="/marketplace/faucet" component={MarketplaceFaucet} />
            <ProtectedRoute
              path={['/marketplace/sell/:id', '/marketplace/sell']}
              component={MarketplaceSell}
            />
            <ProtectedRoute path="/marketplace/buy/:id" component={MarketplaceBuy} />
            <Route exact path="/marketplace/login" component={MarketplaceAuth} />
            <Route exact path="/login" component={Auth} />
            <Redirect from="/" to="/home" />
          </Switch>
        </Router>
      </TokenContextState>
    </AuthContextState>
  );
};
