import gql from 'graphql-tag';
import { withProps } from 'modules/common/utils';
import CompanyEntry from 'modules/robot/components/assistant/CompanyEntry';
import { EntriesQueryResponse } from 'modules/robot/types';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import { queries } from '../../graphql';

type Props = {
  parentId: string;
  action: string;
};

type FinalProps = {
  entriesQuery: EntriesQueryResponse;
} & Props;

class CompanyEntryContainer extends React.Component<FinalProps> {
  render() {
    const { entriesQuery } = this.props;

    const entries = entriesQuery.robotEntries || [];

    const updatedProps = {
      ...this.props,
      entries
    };

    return <CompanyEntry {...updatedProps} />;
  }
}

export default withProps<Props>(
  compose(
    graphql<Props>(gql(queries.entries), {
      options: ({ parentId, action }) => ({
        variables: { parentId, action, isNotified: false }
      }),
      name: 'entriesQuery'
    })
  )(CompanyEntryContainer)
);
