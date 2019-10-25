import gql from 'graphql-tag';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import { withProps } from '../../common/utils';
import ActionItem from '../components/ActionItem';
import { queries } from '../graphql';
import { EntriesQueryResponse, IEntry } from '../types';

type Props = {
  action?: string;
  icon?: string;
  color?: string;
  title: string;
  vertical?: boolean;
  description?: string;
  onClick?: () => void;
  isComplete?: boolean;
  disabled?: boolean;
};

type FinalProps = {
  entriesQuery: EntriesQueryResponse;
} & Props;

class ActionItemContainer extends React.Component<FinalProps> {
  getActionCount = (entries: IEntry[]) => {
    if (!entries || entries.length === 0) {
      return null;
    }

    const data = entries.length && entries[0].data;

    switch (this.props.action) {
      case 'fillCompanyInfo':
        return data.count;

      case 'customerScoring':
        return data.scoreMap.length;

      default:
        return null;
    }
  };

  render() {
    const { entriesQuery } = this.props;

    const entries = entriesQuery.robotEntries || [];

    const updatedProps = {
      ...this.props,
      entries,
      count: this.getActionCount(entries)
    };

    return <ActionItem {...updatedProps} />;
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
  )(ActionItemContainer)
);
