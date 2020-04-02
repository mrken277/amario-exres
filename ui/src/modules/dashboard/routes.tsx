import cubejs from '@cubejs-client/core';
import { CubeProvider } from '@cubejs-client/react';
import asyncComponent from 'modules/common/components/AsyncComponent';
import queryString from 'query-string';
import React from 'react';
import { Route } from 'react-router-dom';

const ExplorePage = asyncComponent(() =>
  import(/* webpackChunkName: "ExplorePage - Dashboard" */ './containers/ExplorePage')
);

const DashboardPage = asyncComponent(() =>
  import(/* webpackChunkName: "DashboardPage - Dashboard" */ './containers/DashboardPage')
);

const List = asyncComponent(() =>
  import(/* webpackChunkName: "Settings - List EmailTemplate" */ './containers/DashboardList')
);

const dashboards = ({ location }) => {
  return <List queryParams={queryString.parse(location.search)} />;
};

const dashboardDetail = ({ match, history }) => {
  const id = match.params.id;

  return <DashboardPage history={history} id={id} />;
};

const explorePage = history => {
  return <ExplorePage history={history} />;
};

const CUBEJS_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1ODQ2MzI5ODcsImV4cCI6MTU4NDcxOTM4N30.HYBOZrBDOu-cx2xy_6bEqtY50ayjia7jP5NS2tyYP7c';

const API_URL = 'http://localhost:4000';

const cubejsApi = cubejs(CUBEJS_TOKEN, {
  apiUrl: `${API_URL}/cubejs-api/v1`
});

const routes = () => {
  return (
    <CubeProvider cubejsApi={cubejsApi}>
      <React.Fragment>
        <Route
          key="/dashboard/list"
          exact={true}
          path="/dashboard"
          component={dashboards}
        />
        <Route
          key="/dashboard/detail"
          exact={true}
          path="/dashboard/details/:id"
          component={dashboardDetail}
        />

        <Route
          key="/dashboard/explore"
          exact={true}
          path="/dashboard/explore"
          component={explorePage}
        />
      </React.Fragment>
    </CubeProvider>
  );
};

export default routes;
