import asyncComponent from 'modules/common/components/AsyncComponent';
import React from 'react';
import { Route } from 'react-router-dom';

const ExplorePage = asyncComponent(() =>
  import(/* webpackChunkName: "ExplorePage - Dashboard" */ './containers/ExplorePage')
);

const DashboardPage = asyncComponent(() =>
  import(/* webpackChunkName: "DashboardPage - Dashboard" */ './containers/DashboardPage')
);

const dashBoard = history => {
  return <DashboardPage history={history} />;
};

const explorePage = history => {
  return <ExplorePage history={history} />;
};

const routes = () => {
  return (
    <React.Fragment>
      <Route
        key='/dashboard/home'
        exact={true}
        path='/dashboard'
        component={dashBoard}
      />

      <Route
        key='/engage/messages/create'
        exact={true}
        path='/dashboard/explore'
        component={explorePage}
      />
    </React.Fragment>
  );
};

export default routes;
