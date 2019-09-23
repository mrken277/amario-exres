import gql from 'graphql-tag';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import { withProps } from '../../common/utils';
import Robot from '../components/Robot';
import { queries } from '../graphql';

type Props = {
  entriesQuery: any;
};

class RobotContainer extends React.Component<Props> {
  render() {
    const { entriesQuery } = this.props;

    const updatedProps = {
      ...this.props,
      entries: entriesQuery.robotEntries || []
    };

    return <Robot {...updatedProps} />;
  }
}

export default withProps<{}>(
  compose(
    graphql<{}, any>(gql(queries.entries), {
      name: 'entriesQuery'
    })
  )(RobotContainer)
);
