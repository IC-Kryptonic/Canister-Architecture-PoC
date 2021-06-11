import React from 'react';
import { Router, Switch, Route, Redirect } from 'react-router-dom';
import TestVideoInfo from './pages/TestVideoInfo';
import History from './components/History';
import Feed from './pages/Feed';
import Upload from './pages/Upload';

export const AppRouter = () => {
  return (
    <Router history={History}>
      <Switch>
        <Route exact path="/test-upload" component={TestVideoInfo} />
        <Route exact path="/upload" component={Upload} />
        <Route exact path="/feed" component={Feed} />
        <Redirect from="/" to="/feed" />
      </Switch>
    </Router>
  );
};
