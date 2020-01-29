import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Spinner from 'modules/common/components/Spinner';
import Entry from 'modules/settings/integrations/components/store/Entry';
import { queries } from 'modules/settings/integrations/graphql';
import React from 'react';
import { MessengerAppsCountQueryResponse } from '../types';

type Props = {
  integration: any;
  getClassName: (selectedKind: string) => string;
  toggleBox: (kind: string) => void;
  kind: string;
  queryParams: any;
  totalCount: {
    messenger: number;
    form: number;
    facebook: number;
    gmail: number;
    callpro: number;
    chatfuel: number;
    imap: number;
    office365: number;
    outlook: number;
    yahoo: number;
  };
};

const StoreEntry = (props: Props) => {
  const {
    loading: messengerAppsCountQueryLoading,
    error: messengerAppsCountQueryError,
    data: messengerAppsCountQueryData
  } = useQuery<MessengerAppsCountQueryResponse>(
    gql(queries.messengerAppsCount),
    {
      variables: { kind: props.kind },
      fetchPolicy: 'network-only'
    }
  );

  if (messengerAppsCountQueryLoading) {
    return <Spinner />;
  }

  if (messengerAppsCountQueryError) {
    return <p>Error!</p>;
  }

  const messengerAppsCount = messengerAppsCountQueryData ? messengerAppsCountQueryData.messengerAppsCount : 0;

  const updatedProps = {
    ...props,
    messengerAppsCount
  };

  return <Entry {...updatedProps} />;
};

export default StoreEntry;
