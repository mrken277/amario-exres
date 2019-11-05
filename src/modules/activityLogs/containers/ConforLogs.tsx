import { AppConsumer } from 'appContext';
import gql from 'graphql-tag';
import { IUser } from 'modules/auth/types';
import { withProps } from 'modules/common/utils';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import { ConfLogQueryResponse } from '../../customers/types';
import ConforLogs from '../components/ConforLogs';
import { queries, subscriptions } from '../graphql';

type Props = {
  contentId: string;
  contentType: string;
  target?: string;
  extraTabs: Array<{ name: string; label: string }>;
};

type FinalProps = {
  conformitiesForActivityQuery: ConfLogQueryResponse;
} & WithDataProps;

class Container extends React.Component<FinalProps, {}> {
  componentWillMount() {
    const { conformitiesForActivityQuery } = this.props;

    conformitiesForActivityQuery.subscribeToMore({
      document: gql(subscriptions.activityLogsChanged),
      updateQuery: () => {
        this.props.conformitiesForActivityQuery.refetch();
      }
    });
  }

  render() {
    const {
      target,
      conformitiesForActivityQuery,
      onChangeActivityTab,
      extraTabs
    } = this.props;

    const props = {
      target,
      loadingLogs: conformitiesForActivityQuery.loading,
      activityLogs: conformitiesForActivityQuery.conformitiesForActivity || [],
      onTabClick: onChangeActivityTab,
      extraTabs
    };

    return (
      <AppConsumer>
        {({ currentUser }) => (
          <ConforLogs {...props} currentUser={currentUser || ({} as IUser)} />
        )}
      </AppConsumer>
    );
  }
}

type WithDataProps = Props & {
  onChangeActivityTab: (currentTab: string) => void;
  activityType: string;
};

const WithData = withProps<WithDataProps>(
  compose(
    graphql<WithDataProps, ConfLogQueryResponse>(
      gql(queries.conformitiesForActivity),
      {
        name: 'conformitiesForActivityQuery',
        options: ({ contentId, contentType, activityType }: WithDataProps) => {
          return {
            variables: {
              contentId,
              contentType,
              activityType: activityType === 'activity' ? '' : activityType
            }
          };
        }
      }
    )
  )(Container)
);

export default class Wrapper extends React.Component<
  Props,
  { activityType: string }
> {
  constructor(props) {
    super(props);

    this.state = {
      activityType: ''
    };
  }

  onChangeActivityTab = (currentTab: string) => {
    this.setState({ activityType: currentTab });
  };

  render() {
    const { contentId, contentType, target, extraTabs } = this.props;
    return (
      <WithData
        target={target}
        contentId={contentId}
        contentType={contentType}
        extraTabs={extraTabs}
        activityType={this.state.activityType}
        onChangeActivityTab={this.onChangeActivityTab}
      />
    );
  }
}
