import gql from 'graphql-tag';
import Spinner from 'modules/common/components/Spinner';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import { withProps } from '../../common/utils';
import Robot from '../components/Robot';
import { queries } from '../graphql';

type Props = {
  robotEntriesQuery: any;
};

const StatusContainer = (props: Props) => {
  const { robotEntriesQuery } = props;

  if (robotEntriesQuery.loading) {
    return <Spinner objective={true} />;
  }

  const updatedProps = {
    ...props,
    robotEntries: robotEntriesQuery.robotEntries || []
  };

  return <Robot {...updatedProps} />;
};

export default withProps<{}>(
  compose(
    graphql<{}, any>(gql(queries.entries), {
      name: 'robotEntriesQuery'
    })
  )(StatusContainer)
);
