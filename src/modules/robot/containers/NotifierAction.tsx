import gql from 'graphql-tag';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import { withProps } from '../../common/utils';
import NotifierAction from '../components/notifier/NotifierAction';
import { queries } from '../graphql';
import { EntriesQueryResponse } from '../types';

type Props = {
  action: string;
  closable?: boolean;
  background?: string;
  delay?: number;
};

type FinalProps = {
  entriesQuery: EntriesQueryResponse;
} & Props;

class NotifierActionContainer extends React.Component<FinalProps> {
  render() {
    const { entriesQuery } = this.props;

    const entries = entriesQuery.robotEntries || [];

    const updatedProps = {
      ...this.props,
      entries
    };

    return <NotifierAction {...updatedProps} />;
  }
}

export default withProps<Props>(
  compose(
    graphql<Props>(gql(queries.entries), {
      options: ({ action }) => ({
        variables: { action }
      }),
      name: 'entriesQuery'
    })
  )(NotifierActionContainer)
);
