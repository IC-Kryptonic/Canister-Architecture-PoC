import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import TestVideoInfo from './pages/TestVideoInfo';
import Feed from './pages/Feed';

export const AppRouter = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/test-upload" component={TestVideoInfo} />
        <Route exact path="/" component={Feed} />
      </Switch>
    </Router>
  );
};
