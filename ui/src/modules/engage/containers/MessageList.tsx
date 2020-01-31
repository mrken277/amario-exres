import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Bulk from 'modules/common/components/Bulk';
import ErrorMsg from 'modules/common/components/ErrorMsg';
import Spinner from 'modules/common/components/Spinner';
import { IRouterProps } from 'modules/common/types';
import checkError from 'modules/common/utils/checkError';
import queryString from 'query-string';
import React, { useState } from 'react';
import { withRouter } from 'react-router';
import MessageList from '../components/MessageList';
import { queries } from '../graphql';
import {
  EngageMessagesQueryResponse,
  EngageMessagesTotalCountQueryResponse,
  ListQueryVariables
} from '../types';
import { generateListQueryVariables } from '../utils';

type Props = {
  type: string;
  queryParams: any;
  loading: boolean;
};

type State = {
  bulk: any[];
  isAllSelected: boolean;
};

export const MessageListContainer = (props: Props, state: State) => {
  const [isAllSelected] = useState(false);
  const [bulk] = useState([]);

  const {
    queryParams
  } = props;

  const {
    loading: engageMessagesLoading,
    error: engageMessagesError,
    data: engageMessagesData
  } = useQuery<EngageMessagesQueryResponse, ListQueryVariables>(
    gql(queries.engageMessages), {
    variables: generateListQueryVariables(props)
  });

  const {
    loading: engageMessagesTotalCountLoading,
    error: engageMessagesTotalCountError,
    data: engageMessagesTotalCountData
  } = useQuery<EngageMessagesTotalCountQueryResponse, ListQueryVariables>(
    gql(queries.engageMessagesTotalCount), {
    variables: generateListQueryVariables(props)
  });

  if (engageMessagesTotalCountLoading) {
    return <Spinner objective={true} />;
  };

  if (engageMessagesError || engageMessagesTotalCountError) {
    const error = checkError([engageMessagesError, engageMessagesTotalCountError]);

    return <ErrorMsg>{error.message}</ErrorMsg>;
  };

  const updatedProps = {
    kind: queryParams.kind,
    messages: engageMessagesData ? engageMessagesData.engageMessages : [],
    totalCount: engageMessagesTotalCountData ? engageMessagesTotalCountData.engageMessagesTotalCount : 0,
    bulk,
    isAllSelected,
    queryParams,
    loading: engageMessagesLoading
  };

  const content = lastprops => {
    return <MessageList {...updatedProps} {...lastprops} />;
  };

  return <Bulk content={content} />;
};

const EngageListContainer = (props: IRouterProps & Props) => {
  const queryParams = queryString.parse(props.location.search);

  const extendedProps = { ...props, queryParams };

  return <MessageListContainer {...extendedProps} />;
};

export default withRouter<IRouterProps & Props>(EngageListContainer);
