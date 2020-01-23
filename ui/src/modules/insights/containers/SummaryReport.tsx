import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import ErrorMsg from 'modules/common/components/ErrorMsg';
import Spinner from 'modules/common/components/Spinner';
import checkError from 'modules/common/utils/checkError';
import React from 'react';
import { BrandsQueryResponse } from '../../settings/brands/types';
import SummaryReport from '../components/SummaryReport';
import { queries } from '../graphql';
import { IQueryParams, SummaryQueryResponse } from '../types';

type Props = {
  history: any;
  queryParams: IQueryParams;
};

function SummaryReportContainer(props: Props) {
  const { history, queryParams } = props;

  const {
    loading: summaryQueryLoading,
    error: summaryQueryError,
    data: summaryQueryData
  } = useQuery<SummaryQueryResponse, IQueryParams>(
    gql(queries.responseSummary),
    {
      fetchPolicy: 'network-only',
      notifyOnNetworkStatusChange: true,
      variables: queryParams
    }
  );

  const {
    loading: brandsQueryLoading,
    error: brandsQueryError,
    data: brandsQueryData
  } = useQuery<BrandsQueryResponse>(gql(queries.brands));

  if (summaryQueryError || brandsQueryError) {
    const error = checkError([summaryQueryError, brandsQueryError]);

    return <ErrorMsg>{error.message}</ErrorMsg>;
  }

  if (summaryQueryLoading || brandsQueryLoading) {
    return <Spinner objective={true} />;
  }

  const data = summaryQueryData && summaryQueryData.insightsConversation;

  const extendedProps = {
    history,
    queryParams,
    trend: (data && data.trend) || [],
    brands: (brandsQueryData && brandsQueryData.brands) || [],
    summary: (data && data.summary) || [],
    loading: summaryQueryLoading || brandsQueryLoading
  };

  return <SummaryReport {...extendedProps} />;
}

export default SummaryReportContainer;
