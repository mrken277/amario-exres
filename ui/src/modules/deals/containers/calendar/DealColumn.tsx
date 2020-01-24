import { useQuery } from '@apollo/react-hooks';
import dayjs from 'dayjs';
import gql from 'graphql-tag';
import ErrorMsg from 'modules/common/components/ErrorMsg';
import Spinner from 'modules/common/components/Spinner';
import { IDateColumn } from 'modules/common/types';
import { getMonthTitle, getMonthYear } from 'modules/common/utils/calendar';
import checkError from 'modules/common/utils/checkError';
import DealColumn from 'modules/deals/components/calendar/DealColumn';
import {
  DealsQueryResponse,
  DealsTotalAmountsQueryResponse,
  IDeal
} from 'modules/deals/types';
import React, { useEffect } from 'react';
import { queries } from '../../graphql';

type Props = {
  updatedAt: string;
  pipelineId: string;
  date: IDateColumn;
  queryParams: any;
  onColumnUpdated: (date: IDateColumn) => void;
};

const getCommonParams = queryParams => {
  if (!queryParams) {
    return {};
  }

  return {
    customerIds: queryParams.customerIds,
    companyIds: queryParams.companyIds,
    assignedUserIds: queryParams.assignedUserIds,
    productIds: queryParams.productIds,
    labelIds: queryParams.labelIds,
    search: queryParams.search
  };
};

function DealColumnContainer(props: Props) {
  const { date, pipelineId, queryParams, updatedAt } = props;

  const {
    error: dealsError,
    loading: dealsLoading,
    data: dealsData,
    fetchMore,
    refetch: dealsRefetch
  } = useQuery<DealsQueryResponse>(gql(queries.deals), {
    notifyOnNetworkStatusChange: true,
    variables: {
      skip: 0,
      date,
      pipelineId,
      ...getCommonParams(queryParams)
    }
  });

  const {
    error: dealsTotalAmountsError,
    loading: dealsTotalAmountsLoading,
    data: dealsTotalAmountsData,
    refetch: dealsTotalAmountsRefetch
  } = useQuery<DealsTotalAmountsQueryResponse>(gql(queries.dealsTotalAmounts), {
    variables: {
      date,
      pipelineId,
      ...getCommonParams(queryParams)
    }
  });

  useEffect(
    () => {
      dealsRefetch();
      dealsTotalAmountsRefetch();
    },
    [updatedAt]
  ); // Only re-run the effect if updatedAt changes

  if (dealsError || dealsTotalAmountsError) {
    const error = checkError([dealsError, dealsTotalAmountsError]);

    return <ErrorMsg>{error.message}</ErrorMsg>;
  }

  if (dealsLoading || dealsTotalAmountsLoading) {
    return <Spinner objective={true} />;
  }

  // Update calendar after stage updated
  if (localStorage.getItem('cacheInvalidated') === 'true') {
    localStorage.setItem('cacheInvalidated', 'false');

    dealsRefetch();
    dealsTotalAmountsRefetch();
  }

  const title = getMonthTitle(date.month);
  const deals = (dealsData && dealsData.deals) || [];
  const dealTotalAmounts =
    dealsTotalAmountsData && dealsTotalAmountsData.dealsTotalAmounts;

  const updateDeals = (deal?: IDeal) => {
    dealsRefetch();
    dealsTotalAmountsRefetch();

    if (deal) {
      const { onColumnUpdated } = props;

      const convertedDate = dayjs(deal.closeDate);
      const monthAndYear = getMonthYear(convertedDate);

      onColumnUpdated(monthAndYear);
    }
  };

  const onLoadMore = (skip: number) => {
    fetchMore({
      variables: { skip },
      updateQuery: (prev: DealsQueryResponse, { fetchMoreResult }) => {
        if (!fetchMoreResult || fetchMoreResult.deals.length === 0) {
          return prev;
        }

        return {
          ...prev,
          deals: prev.deals.concat(fetchMoreResult.deals)
        };
      }
    });
  };

  const updatedProps = {
    ...props,
    deals,
    title,
    onLoadMore,
    onRemove: updateDeals,
    onUpdate: updateDeals,
    dealTotalAmounts
  };

  return <DealColumn {...updatedProps} />;
}

export default DealColumnContainer;
