import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Spinner from 'modules/common/components/Spinner';
import { IRouterProps } from 'modules/common/types';
import { router as routerUtils } from 'modules/common/utils';
import queryString from 'query-string';
import React, { useEffect } from 'react';
import { withRouter } from 'react-router';
import { IntegrationsCountQueryResponse } from '../../integrations/types';
import DumbChannels from '../components/Channels';
import Empty from '../components/Empty';
import { queries } from '../graphql';
import {
  ChannelDetailQueryResponse,
  ChannelsGetLastQueryResponse,
  IChannel
} from '../types';

type Props = {
  currentChannelId: string;
  location: any;
  history: any;
  queryParams: any;
};

const ChannelsContainer = (props: Props) => {
  const { location, currentChannelId } = props;

  const {
    loading: channelDetailQueryLoading,
    error: channelDetailQueryError,
    data: channelDetailQueryData
  } = useQuery<ChannelDetailQueryResponse, { _id: string }>(
    gql(queries.channelDetail),
    {
      variables: { _id: currentChannelId },
      fetchPolicy: 'network-only'
    }
  );

  const {
    loading: integrationsCountQueryLoading,
    error: integrationsCountQueryError,
    data: integrationsCountQueryData
  } = useQuery<IntegrationsCountQueryResponse, { channelId: string }>(
    gql(queries.integrationsCount),
    { variables: { channelId: currentChannelId } }
  );

  if (channelDetailQueryError || integrationsCountQueryError) {
    return <p>Error!</p>;
  }

  if (channelDetailQueryLoading || integrationsCountQueryLoading) {
    return <p>Loading...</p>;
  }

  let integrationsCount = 0;

  if (!integrationsCountQueryLoading) {
    const byChannel = integrationsCountQueryData ? integrationsCountQueryData.integrationsTotalCount.byChannel : {};
    integrationsCount = byChannel[currentChannelId];
  }

  const extendedProps = {
    ...props,
    queryParams: queryString.parse(location.search),
    currentChannel: channelDetailQueryData ? channelDetailQueryData.channelDetail : {} as IChannel,
    loading: channelDetailQueryLoading,
    integrationsCount
  };

  return <DumbChannels {...extendedProps} />;
}

type withCurrentIdProps = {
  queryParams: any;
  history: any;
  location: any;
};

const WithCurrentId = (props: withCurrentIdProps) => {
  const { queryParams, history } = props;

  const {
    loading: lastChannelQueryLoading,
    error: lastChannelQueryError,
    data: lastChannelQueryData
  } = useQuery<ChannelsGetLastQueryResponse, { _id: string }>(
    gql(queries.channelsGetLast),
    {
      variables: { _id: queryParams._id },
      skip: queryParams._id,
      fetchPolicy: 'network-only'
    });

  useEffect(() => {
    if (!queryParams._id && lastChannelQueryData && lastChannelQueryData.channelsGetLast && !lastChannelQueryLoading && !history.location.hash) {
      routerUtils.setParams(
        history,
        { _id: lastChannelQueryData.channelsGetLast._id },
        true
      );
    }
  });

  if (lastChannelQueryError) {
    return <p>Error!</p>;
  }

  if (lastChannelQueryLoading) {
    return <Spinner objective={true} />;
  }

  if (!queryParams._id) {
    return <Empty {...props} />;
  }

  const updatedProps = {
    ...props,
    currentChannelId: queryParams._id
  };

  return <ChannelsContainer {...updatedProps} />;
}

const WithQueryParams = (props: IRouterProps) => {
  const { location } = props;
  const queryParams = queryString.parse(location.search);

  const extendedProps = { ...props, queryParams };

  return <WithCurrentId {...extendedProps} />;
};

export default withRouter<IRouterProps>(WithQueryParams);
