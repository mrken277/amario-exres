import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { generatePaginationParams } from 'modules/common/utils/router';
import * as React from 'react';
import LogList from '../components/LogList';
import queries from '../queries';
import { LogsQueryResponse } from '../types';

type Props = {
  history: any;
  queryParams: any;
};

type FinalProps = {
  can: (action: string) => boolean;
} & Props;

const List = (props: FinalProps) => {
  const { queryParams } = props;

  const {
    loading: logsQueryLoading,
    error: logsQueryError,
    data: logsQueryData
  } = useQuery<LogsQueryResponse>(gql(queries.logs),
    {
      notifyOnNetworkStatusChange: true,
      variables: {
        start: queryParams.start,
        end: queryParams.end,
        userId: queryParams.userId,
        action: queryParams.action,
        ...generatePaginationParams(queryParams)
      }
    }
  );

  const errorMessage = logsQueryData && logsQueryData.error ? logsQueryData.error.message : '';
  const isLoading = logsQueryLoading;

  if (logsQueryError) {
    return <p>Error!</p>;
  }

  if (logsQueryLoading) {
    return <p>Loading...</p>;
  }

  const updatedProps = {
    ...props,
    isLoading: logsQueryLoading,
    refetchQueries: commonOptions(queryParams),
    logs: isLoading || errorMessage ? [] : logsQueryData ? logsQueryData.logs.logs : [],
    count: isLoading || errorMessage ? 0 : logsQueryData ? logsQueryData.logs.totalCount : 0,
    errorMessage
  };

  return <LogList {...updatedProps} />;
};

const commonOptions = queryParams => {
  const variables = {
    start: queryParams.start,
    end: queryParams.end,
    userId: queryParams.userId,
    action: queryParams.action,
    ...generatePaginationParams(queryParams)
  };

  return [{ query: gql(queries.logs), variables }];
};

export default List;
