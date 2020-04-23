import cubejs from '@cubejs-client/core';
import { CubeProvider } from '@cubejs-client/react';
import asyncComponent from 'modules/common/components/AsyncComponent';
import queryString from 'query-string';
import React from 'react';
import { Route } from 'react-router-dom';

const ExplorePage = asyncComponent(() =>
  import(/* webpackChunkName: "ExplorePage - Dashboard" */ './containers/Explore')
);

const DashboardDetail = asyncComponent(() =>
  import(/* webpackChunkName: "DashboardDetail - Dashboard" */ './containers/DashboardDetail')
);

const DashboardList = asyncComponent(() =>
  import(/* webpackChunkName: "Dashboards" */ './containers/DashboardList')
);

const dashboards = ({ location, history }) => {
  return (
    <DashboardList
      history={history}
      queryParams={queryString.parse(location.search)}
    />
  );
};

const dashboardDetail = ({ match, history }) => {
  const id = match.params.id;

  return <DashboardDetail history={history} id={id} />;
};

const explorePage = ({ history, location }) => {
  const queryParams = queryString.parse(location.search);

  return <ExplorePage history={history} queryParams={queryParams} />;
};

const CUBEJS_TOKEN =
  '74a71d4eb1c44e14d626a72f0f2c89d55d80173a6298d0495157634ea98b82fe6541372d615b2252007a446c423bbe2b66116b0831239088c6652ce014a3b8d';

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
