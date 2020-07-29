import asyncComponent from 'modules/common/components/AsyncComponent';
import queryString from 'query-string';
import React from 'react';
import { Route } from 'react-router-dom';

const CarDetails = asyncComponent(() =>
  import(/* webpackChunkName: "CarDetails" */ './containers/detail/CarDetails')
);

const CarsList = asyncComponent(() =>
  import(/* webpackChunkName: "CarsList" */ './containers/CarsList')
);

const details = ({ match }) => {
  const id = match.params.id;

  return <CarDetails id={id} />;
};

const list = ({ location }) => {
  const queryParams = queryString.parse(location.search);

  localStorage.setItem('erxes_contact_url', 'cars');

  return <CarsList queryParams={queryParams} />;
};

const routes = () => {
  return (
    <React.Fragment>
      <Route
        path="/cars/details/:id"
        exact={true}
        key="/cars/details/:id"
        component={details}
      />

      <Route path="/cars" exact={true} key="/cars" component={list} />
    </React.Fragment>
  );
};

export default routes;
