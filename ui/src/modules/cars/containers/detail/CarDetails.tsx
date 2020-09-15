import gql from 'graphql-tag';
import * as compose from 'lodash.flowright';
import EmptyState from 'modules/common/components/EmptyState';
import Spinner from 'modules/common/components/Spinner';
import { withProps } from 'modules/common/utils';
import React from 'react';
import { graphql } from 'react-apollo';
import { IUser } from 'modules/auth/types';
import CarDetails from '../../components/detail/CarDetails';
import { queries } from '../../graphql';
import { DetailQueryResponse } from '../../types';

type Props = {
  id: string;
};

type FinalProps = {
  carDetailQuery: DetailQueryResponse;
  currentUser: IUser;
} & Props;

const CarDetailsContainer = (props: FinalProps) => {
  const { id, carDetailQuery, currentUser } = props;

  if (carDetailQuery.loading) {
    return <Spinner objective={true} />;
  }

  if (!carDetailQuery.carDetail) {
    return <EmptyState text="Car not found" image="/images/actions/24.svg" />;
  }

  const carDetail = carDetailQuery.carDetail || {};

  const taggerRefetchQueries = [
    {
      query: gql(queries.carDetail),
      variables: { _id: id }
    }
  ];

  const updatedProps = {
    ...props,
    loading: carDetailQuery.loading,
    car: carDetail,
    taggerRefetchQueries,
    currentUser
  };

  return <CarDetails {...updatedProps} />;
};

export default withProps<Props>(
  compose(
    graphql<Props, DetailQueryResponse, { _id: string }>(
      gql(queries.carDetail),
      {
        name: 'carDetailQuery',
        options: ({ id }) => ({
          variables: {
            _id: id
          }
        })
      }
    )
  )(CarDetailsContainer)
);
