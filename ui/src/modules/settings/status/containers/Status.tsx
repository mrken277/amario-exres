import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React from 'react';
import Status from '../components/Status';
import { queries } from '../graphql';
import { ProjectVersions, VersionsQueryResponse } from '../types';

const StatusContainer = () => {
  const {
    loading: versionsQueryLoading,
    error: versionsQueryError,
    data: versionsQueryData
  } = useQuery<VersionsQueryResponse>(
    gql(queries.configsVersions)
  );

  if (versionsQueryError) {
    return <p>Error!</p>;
  }

  if (versionsQueryLoading) {
    return <p>Loading...</p>;
  }

  const updatedProps = {
    versions: versionsQueryData ? versionsQueryData.configsVersions : {} as ProjectVersions
  };

  return <Status {...updatedProps} />;
};

export default StatusContainer;
