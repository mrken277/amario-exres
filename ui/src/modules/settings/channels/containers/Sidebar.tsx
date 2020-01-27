import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import ButtonMutate from 'modules/common/components/ButtonMutate';
import { IButtonMutateProps } from 'modules/common/types';
import { Alert, confirm } from 'modules/common/utils';
import React from 'react';
import Sidebar from '../components/Sidebar';
import { mutations, queries } from '../graphql';
import {
  ChannelsCountQueryResponse,
  ChannelsQueryResponse,
  RemoveChannelMutationResponse,
  RemoveChannelMutationVariables
} from '../types';

type Props = {
  queryParams: any;
  currentChannelId?: string;
  history?: any;
};

const SidebarContainer = (props: Props) => {
  const {
    queryParams,
    history,
    currentChannelId
  } = props;

  const {
    loading: channelsQueryLoading,
    error: channelsQueryError,
    data: channelsQueryData
  } = useQuery<ChannelsQueryResponse, { perPage: number }>(
    gql(queries.channels),
    {
      variables: {
        perPage: queryParams.limit ? parseInt(queryParams.limit, 10) : 20
      },
      fetchPolicy: 'network-only'
    }
  );

  const {
    loading: channelsCountQueryLoading,
    error: channelsCountQueryError,
    data: channelsCountQueryData
  } = useQuery<ChannelsCountQueryResponse>(gql(queries.channels));

  const [removeMutation, { error: channelRemoveMutationError }] =
    useMutation<RemoveChannelMutationResponse, RemoveChannelMutationVariables>(
      gql(mutations.channelRemove), {
      refetchQueries: getRefetchQueries(queryParams, currentChannelId)
    });

  // remove action
  const remove = channelId => {
    confirm().then(() => {
      removeMutation({
        variables: { _id: channelId }
      })
        .then(() => {
          Alert.success('You successfully deleted a channel.');

          history.push('/settings/channels');
        })
        .catch(error => {
          Alert.error(error.message);
        });
    });
  };

  const renderButton = ({
    name,
    values,
    isSubmitted,
    callback,
    object
  }: IButtonMutateProps) => {
    return (
      <ButtonMutate
        mutation={object ? mutations.channelEdit : mutations.channelAdd}
        variables={values}
        callback={callback}
        refetchQueries={getRefetchQueries(queryParams, currentChannelId)}
        isSubmitted={isSubmitted}
        type="submit"
        successMessage={`You successfully ${
          object ? 'updated' : 'added'
          } a ${name}`}
      />
    );
  };

  const channels = channelsQueryData ? channelsQueryData.channels : [];
  const channelsTotalCount = channelsCountQueryData ? channelsCountQueryData.channelsTotalCount : 0;

  if (channelsQueryError || channelsCountQueryError || channelRemoveMutationError) {
    return <p>Error!</p>;
  }

  if (channelsCountQueryLoading || channelsQueryLoading) {
    return <p>Loading...</p>;
  }

  const updatedProps = {
    ...props,
    channels,
    channelsTotalCount,
    remove,
    renderButton,
    loading: channelsQueryLoading
  };

  return <Sidebar {...updatedProps} />;
};

const getRefetchQueries = (queryParams, currentChannelId?: string) => {
  return [
    {
      query: gql(queries.channels),
      variables: {
        perPage: queryParams.limit ? parseInt(queryParams.limit, 10) : 20
      }
    },
    {
      query: gql(queries.channels),
      variables: {}
    },
    {
      query: gql(queries.integrationsCount),
      variables: {}
    },
    {
      query: gql(queries.channelDetail),
      variables: { _id: currentChannelId || '' }
    },
    { query: gql(queries.channelsCount) }
  ];
};

export default SidebarContainer;
