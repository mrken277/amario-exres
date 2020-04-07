import gql from 'graphql-tag';
import * as compose from 'lodash.flowright';
import ButtonMutate from 'modules/common/components/ButtonMutate';
import Spinner from 'modules/common/components/Spinner';
import { IButtonMutateProps } from 'modules/common/types';
import { withProps } from 'modules/common/utils';
import React from 'react';
import { graphql } from 'react-apollo';
import Dashboard from '../components/Dashboard';
import { mutations, queries } from '../graphql';
import { DashboardItemDetailsQueryResponse } from '../types';

type Props = {
  id: string;
};

type FinalProps = {
  dashBoardItemDetailsQuery: DashboardItemDetailsQueryResponse;
} & Props;

class DashboardContainer extends React.Component<FinalProps, {}> {
  render() {
    const { dashBoardItemDetailsQuery } = this.props;

    if (dashBoardItemDetailsQuery.loading) {
      return <Spinner objective={true} />;
    }

    const renderButton = ({
      name,
      values,
      isSubmitted,
      callback,
      object
    }: IButtonMutateProps) => {
      return (
        <ButtonMutate
          mutation={
            object ? mutations.dashboardEdit : mutations.dashboardItemAdd
          }
          variables={values}
          callback={callback}
          refetchQueries={['dashboardItemsQuery']}
          isSubmitted={isSubmitted}
          type="submit"
          successMessage={`You successfully ${
            object ? 'updated' : 'added'
          } a ${name}`}
        />
      );
    };
    return (
      <ChartDetail
        editDashboardItem={editDashboardItem}
        dashboardItems={dashBoardItemDetailsQuery.dashboardItem || []}
      />
    );
  }
}

export default withProps<Props>(
  compose(
    graphql<Props, DashboardItemDetailsQueryResponse, { _id: string }>(
      gql(queries.dashboardItemDetail),
      {
        name: 'dashBoardItemDetailsQuery',
        options: ({ id }: { id: string }) => ({
          variables: {
            _id: id
          },
          skip: !id
        })
      }
    )
  )(DashboardContainer)
);
