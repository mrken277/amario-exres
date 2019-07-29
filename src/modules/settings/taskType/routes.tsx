import asyncComponent from 'modules/common/components/AsyncComponent';
import React from 'react';
import { Route } from 'react-router-dom';

const List = asyncComponent(() =>
  import(/* webpackChunkName: "Settings List - TaskTypes" */ './containers/List')
);

const routes = () => <Route path="/settings/task-types" component={List} />;

export default routes;
