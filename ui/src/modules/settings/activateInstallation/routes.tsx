import asyncComponent from 'modules/common/components/AsyncComponent';
import React from 'react';
import { Route } from 'react-router-dom';

const Home = asyncComponent(() =>
  import(
    /* webpackChunkName: "Settings - Activate Installation" */ './components/Home'
  )
);

const routes = () => (
  <Route path="/settings/activate-installation" component={Home} />
);

export default routes;
