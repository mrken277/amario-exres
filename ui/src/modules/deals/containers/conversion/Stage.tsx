import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { IStage } from 'modules/boards/types';
import EmptyState from 'modules/common/components/EmptyState';
import ErrorMsg from 'modules/common/components/ErrorMsg';
import Spinner from 'modules/common/components/Spinner';
import Stage from 'modules/deals/components/conversion/table/Stage';
import { queries } from 'modules/deals/graphql';
import { DealsQueryResponse, IDeal } from 'modules/deals/types';
import React, { useState } from 'react';

type Props = {
  stage: IStage;
  queryParams: any;
  pipelineId: string;
};

type State = {
  loadingDeals: boolean;
};

export default (props: Props, state: State) => {
  const { stage, pipelineId, queryParams } = props;
  const [loadingDeals, setLoadingDeals] = useState(false);

  const {
    loading: dealsQueryLoading,
    data: dealsQueryData,
    error: dealsQueryError,
    refetch,
    fetchMore
  } = useQuery<DealsQueryResponse>(gql(queries.deals), {
    variables: {
      initialStageId: stage._id,
      pipelineId,
      ...getFilterParams(queryParams)
    }
  });

  if (dealsQueryError) {
    return <ErrorMsg>{dealsQueryError.message}</ErrorMsg>;
  }

  if (dealsQueryLoading) {
    return <Spinner objective={true} />;
  }

  const deals = (dealsQueryData && dealsQueryData.deals) || [];

  if (!deals) {
    return <EmptyState text="Deals not found" icon="piggy-bank" />;
  }

  const hasMore = stage.initialDealsTotalCount > deals.length;

  const loadMore = () => {
    const loading = dealsQueryLoading;

    if (deals.length === stage.initialDealsTotalCount) {
      return;
    }

    if (!loading && hasMore) {
      setLoadingDeals(true);

      fetchMore({
        variables: {
          initialStageId: stage._id,
          skip: deals.length,
          pipelineId,
          ...getFilterParams(queryParams)
        },
        updateQuery: (prev: DealsQueryResponse, { fetchMoreResult }) => {
          setLoadingDeals(false);

          if (!fetchMoreResult) {
            return prev;
          }

          const prevDeals = prev.deals || [];
          const prevDealIds = prevDeals.map((deal: IDeal) => deal._id);
          const fetchedDeals: IDeal[] = [];

          for (const deal of fetchMoreResult.deals) {
            if (!prevDealIds.includes(deal._id)) {
              fetchedDeals.push(deal);
            }
          }

          return {
            ...prev,
            deals: [...prevDeals, ...fetchedDeals]
          };
        }
      });
    }
  };

  if (localStorage.getItem('cacheInvalidated') === 'true') {
    localStorage.setItem('cacheInvalidated', 'false');

    refetch();
  }

  return (
    <Stage
      hasMore={hasMore}
      stage={stage}
      deals={deals}
      loadMore={loadMore}
      loadingDeals={loadingDeals}
    />
  );
};

const getFilterParams = queryParams => {
  if (!queryParams) {
    return {};
  }

  return {
    search: queryParams.search,
    customerIds: queryParams.customerIds,
    companyIds: queryParams.companyIds,
    assignedUserIds: queryParams.assignedUserIds,
    closeDateType: queryParams.closeDateType,
    productIds: queryParams.productIds,
    labelIds: queryParams.labelIds
  };
};
