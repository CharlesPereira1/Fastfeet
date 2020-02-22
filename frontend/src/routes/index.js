import React from 'react';
import { Switch, Route } from 'react-router-dom';

import SignIn from '~/pages/SignIn';
import Dashboard from '~/pages/Dashoboard';
import Profile from '~/pages/Profile';

export default function routes() {
  return (
    <Switch>
      <Route path="/" exact component={SignIn} />
      <Route path="/dashaboard" component={Dashboard} />
      <Route path="/profile" component={Profile} />
    </Switch>
  );
}
