import gql from 'graphql-tag';
import Spinner from 'modules/common/components/Spinner';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import { withProps } from '../../../common/utils';
import Status from '../components/Status';
import { queries } from '../graphql';
import { VersionsQueryResponse } from '../types';

type Props = {
  versionsQuery: VersionsQueryResponse;
  robotEntriesQuery: any;
};

const StatusContainer = (props: Props) => {
  const { versionsQuery, robotEntriesQuery } = props;

  if (versionsQuery.loading || robotEntriesQuery.loading) {
    return <Spinner objective={true} />;
  }

  const updatedProps = {
    ...props,
    versions: versionsQuery.configsVersions || {},
    robotEntries: robotEntriesQuery.configsRobotEntries || []
  };

  return <Status {...updatedProps} />;
};

export default withProps<{}>(
  compose(
    graphql<{}, VersionsQueryResponse>(gql(queries.configsVersions), {
      name: 'versionsQuery'
    }),
    graphql<{}, any>(gql(queries.configsRobotEntries), {
      name: 'robotEntriesQuery'
    })
  )(StatusContainer)
);
