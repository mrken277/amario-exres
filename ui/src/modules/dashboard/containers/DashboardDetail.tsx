import gql from 'graphql-tag';
import * as compose from 'lodash.flowright';
import Spinner from 'modules/common/components/Spinner';
import { withProps } from 'modules/common/utils';
import React from 'react';
import { graphql } from 'react-apollo';
import Dashboard from '../components/Dashboard';
import { mutations, queries } from '../graphql';
import {
  DashboardItemsQueryResponse,
  EditDashboardItemMutationResponse,
  EditDashboardItemMutationVariables
} from '../types';

type Props = {
  id: string;
};

type FinalProps = {
  dashboardItemsQuery: DashboardItemsQueryResponse;
} & Props &
  EditDashboardItemMutationResponse;

class DashboardContainer extends React.Component<FinalProps, {}> {
  render() {
    const { dashboardItemsQuery, editDashboardItemMutation } = this.props;

    if (dashboardItemsQuery.loading) {
      return <Spinner objective={true} />;
    }

    const editDashboardItem = variables => {
      editDashboardItemMutation({
        variables: {
          ...variables
        }
      });
    };

    return (
      <Dashboard
        editDashboardItem={editDashboardItem}
        dashboardItems={dashboardItemsQuery.dashboardItems || []}
      />
    );
  }
}

export default withProps<Props>(
  compose(
    graphql<Props, DashboardItemsQueryResponse, { dashboardId: string }>(
      gql(queries.dashboardItems),
      {
        name: 'dashboardItemsQuery',
        options: ({ id }: { id: string }) => ({
          variables: {
            dashboardId: id
          }
        })
      }
    ),
    graphql<
      Props,
      EditDashboardItemMutationResponse,
      EditDashboardItemMutationVariables
    >(gql(mutations.dashboardItemEdit), {
      name: 'editDashboardItemMutation',
      options: {
        refetchQueries: ['dashboardItemsQuery']
      }
    })
  )(DashboardContainer)
);
