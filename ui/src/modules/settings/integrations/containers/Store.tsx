import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Spinner from 'modules/common/components/Spinner';
import Home from 'modules/settings/integrations/components/store/Home';
import { queries } from 'modules/settings/integrations/graphql';
import React from 'react';
import { ByKindTotalCount, IntegrationsCountQueryResponse } from '../types';

type Props = {
  queryParams: any;
  history?: any;
};

const Store = (props: Props) => {
  const {
    loading: totalCountQueryLoading,
    error: totalCountQueryError,
    data: totalCountQueryData
  } = useQuery<IntegrationsCountQueryResponse>(
    gql(queries.integrationTotalCount));

  if (totalCountQueryLoading) {
    return <Spinner />;
  }

  if (totalCountQueryError) {
    return <p>Error!</p>;
  }

  const totalCount = totalCountQueryData ? totalCountQueryData.integrationsTotalCount.byKind : {} as ByKindTotalCount;

  const updatedProps = {
    ...props,
    totalCount
  };

  return <Home {...updatedProps} />;
};

export default Store;
