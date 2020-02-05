import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Spinner from 'modules/common/components/Spinner';
import { Alert, confirm } from 'modules/common/utils';
import React from 'react';
import MessengerAppList from '../components/MessengerAppList';
import { mutations, queries } from '../graphql';
import {
  MessengerAppsQueryResponse,
  MessengerAppsRemoveMutationResponse
} from '../types';

type Props = {
  queryParams: any;
  kind?: string | null;
};

const MessengerAppContainer = (props: Props) => {
  const { kind } = props;

  const {
    loading: messengerAppsQueryLoading,
    error: messengerAppsQueryError,
    data: messengerAppsQueryData
  } = useQuery<MessengerAppsQueryResponse>(gql(queries.messengerApps),
    {
      variables: { kind },
      fetchPolicy: 'network-only'
    }
  );

  const [removeMutation, { error: messengerAppsRemoveMutationError }] =
    useMutation<MessengerAppsRemoveMutationResponse, { _id: string }>(
      gql(mutations.messengerAppsRemove), {
      refetchQueries: [{
        query: gql(queries.messengerApps),
        variables: { kind }
      }, {
        query: gql(queries.messengerAppsCount),
        variables: { kind }
      }]
    });

  if (messengerAppsQueryLoading) {
    return <Spinner objective={true} />;
  }

  if (messengerAppsQueryError || messengerAppsRemoveMutationError) {
    return <p>Error!</p>;
  }

  const messengerApps = messengerAppsQueryData ? messengerAppsQueryData.messengerApps : [];

  const remove = app => {
    confirm().then(() => {
      Alert.warning('Removing... Please wait!!!');

      removeMutation({ variables: { _id: app._id } })
        .then(() => {
          Alert.success('You successfully deleted a messenger');
        })

        .catch(error => {
          Alert.error(error.reason);
        });
    });
  };

  const updatedProps = {
    ...props,
    remove,
    messengerApps
  };

  return <MessengerAppList {...updatedProps} />;
};

export default MessengerAppContainer;
