import { AppConsumer } from 'appContext';
import gql from 'graphql-tag';
import { IUser } from 'modules/auth/types';
import { withProps } from 'modules/common/utils';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import { ConfLogQueryResponse } from '../../customers/types';
import ConforLogs from '../components/ActivityLogs';
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
      onChangeTab,
      extraTabs
    } = this.props;

    const props = {
      target,
      loadingLogs: conformitiesForActivityQuery.loading,
      activityLogs: conformitiesForActivityQuery.conformitiesForActivity || [],
      onTabClick: onChangeTab,
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
  onChangeTab: (currentTab: string) => void;
  conformityType: string;
  conformityTypes: string[];
};

const WithData = withProps<WithDataProps>(
  compose(
    graphql<WithDataProps, ConfLogQueryResponse>(
      gql(queries.conformitiesForActivity),
      {
        name: 'conformitiesForActivityQuery',
        options: ({
          contentId,
          conformityType,
          conformityTypes
        }: WithDataProps) => {
          return {
            variables: {
              contentId,
              conformityType:
                conformityType === 'activity' ? '' : conformityType,
              conformityTypes
            }
          };
        }
      }
    )
  )(Container)
);

export default class Wrapper extends React.Component<
  Props,
  { conformityType: string }
> {
  constructor(props) {
    super(props);

    this.state = {
      conformityType: ''
    };
  }

  onChangeTab = (currentTab: string) => {
    this.setState({ conformityType: currentTab });
  };

  render() {
    const { contentId, contentType, target, extraTabs } = this.props;

    const conformityTypes = extraTabs.map(tabs => tabs.name);

    conformityTypes.push('note');

    return (
      <WithData
        target={target}
        contentId={contentId}
        contentType={contentType}
        conformityTypes={conformityTypes}
        extraTabs={extraTabs}
        conformityType={this.state.conformityType}
        onChangeTab={this.onChangeTab}
      />
    );
  }
}
