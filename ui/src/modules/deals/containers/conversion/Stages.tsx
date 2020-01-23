import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { queries } from 'modules/boards/graphql';
import { StagesQueryResponse } from 'modules/boards/types';
import EmptyState from 'modules/common/components/EmptyState';
import ErrorMsg from 'modules/common/components/ErrorMsg';
import Spinner from 'modules/common/components/Spinner';
import List from 'modules/deals/components/conversion/list/List';
import Table from 'modules/deals/components/conversion/table/Table';
import * as React from 'react';

type Props = {
  pipelineId: string;
  queryParams: any;
  type: string;
};

function StagesContainer(props: Props) {
  const { type, pipelineId, queryParams } = props;

  const {
    loading: stagesQueryLoading,
    error: stagesQueryError,
    data: stagesQueryData,
    refetch
  } = useQuery<StagesQueryResponse>(gql(queries.stages), {
    skip: !pipelineId,
    variables: {
      isNotLost: true,
      pipelineId,
      search: queryParams.search,
      customerIds: queryParams.customerIds,
      companyIds: queryParams.companyIds,
      assignedUserIds: queryParams.assignedUserIds,
      productIds: queryParams.productIds,
      closeDateType: queryParams.closeDateType
    }
  });

  if (!stagesQueryData || !stagesQueryData.stages) {
    return (
      <EmptyState
        image="/images/actions/18.svg"
        text="Oh boy, looks like you need to get a head start on your board"
        size="small"
      />
    );
  }

  if (localStorage.getItem('cacheInvalidated') === 'true') {
    refetch({ pipelineId });
  }

  if (stagesQueryError) {
    return <ErrorMsg>{stagesQueryError.message}</ErrorMsg>;
  }

  if (stagesQueryLoading) {
    return <Spinner objective={true} />;
  }

  const stages = stagesQueryData.stages || [];

  if (type === 'more') {
    return <Table {...props} stages={stages} />;
  }

  return <List stages={stages} />;
}

export default StagesContainer;
