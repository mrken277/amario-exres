import gql from 'graphql-tag';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import { withProps } from '../../common/utils';
import ActionItem from '../components/ActionItem';
import { queries } from '../graphql';
import { EntriesQueryResponse, IEntry } from '../types';
import { RobotConsumer } from './RobotContext';

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

      case 'mergeCustomers':
        return entries.length;

      default:
        return null;
    }
  };

  render() {
    const { entriesQuery, onClick, action } = this.props;

    const entries = entriesQuery.robotEntries || [];

    const updatedProps = {
      ...this.props,
      entries,
      count: this.getActionCount(entries)
    };

    if (!onClick) {
      return (
        <RobotConsumer>
          {({ setDatas, setAction, markAsNotified }) => {
            const handleClick = () => {
              setDatas(entries, 'assistantDetail');

              entries.forEach(data => {
                markAsNotified(data._id);
              });

              if (action) {
                setAction(action);
              }
            };

            return (
              <ActionItem
                disabled={entries.length === 0}
                {...updatedProps}
                onClick={handleClick}
              />
            );
          }}
        </RobotConsumer>
      );
    }

    return <ActionItem {...updatedProps} />;
  }
}

export default withProps<Props>(
  compose(
    graphql<Props>(gql(queries.entries), {
      options: ({ action }) => ({
        variables: { action, isNotified: false },
        fetchPolicy: 'network-only'
      }),
      name: 'entriesQuery'
    })
  )(ActionItemContainer)
);
