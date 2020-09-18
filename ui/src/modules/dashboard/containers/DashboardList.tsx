import gql from 'graphql-tag';
import * as compose from 'lodash.flowright';
import { IRouterProps } from 'modules/common/types';
import { withProps } from 'modules/common/utils';
import React from 'react';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import DashboardList from '../components/DashboardList';
import { queries } from '../graphql';
import { DashboardsQueryResponse } from '../types';

type Props = { queryParams: any } & IRouterProps;

type FinalProps = {
  dashboardsQuery: DashboardsQueryResponse;
} & Props;

class DashboardListContainer extends React.Component<FinalProps> {
  render() {
    const { dashboardsQuery } = this.props;

    const dashboards = dashboardsQuery ? dashboardsQuery.dashboards || [] : [];

    return (
      <DashboardList
        {...this.props}
        dashboards={dashboards}
        loading={dashboardsQuery.loading}
      />
    );
  }
}

export default withRouter(
  withProps<Props>(
    compose(
      graphql<Props, DashboardsQueryResponse>(gql(queries.dashboards), {
        name: 'dashboardsQuery'
      })
    )(DashboardListContainer)
  )
);
