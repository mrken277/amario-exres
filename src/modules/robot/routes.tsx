import asyncComponent from 'modules/common/components/AsyncComponent';
import React from 'react';
import { Route } from 'react-router-dom';

const Robot = asyncComponent(() =>
  import(/* webpackChunkName: "Robot" */ './containers/Robot')
);

const routes = () => <Route exact={true} path="/robot/" component={Robot} />;

export default routes;
