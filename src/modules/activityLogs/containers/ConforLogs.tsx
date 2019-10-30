import gql from 'graphql-tag';
import { withProps } from 'modules/common/utils';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import { ConfLogQueryResponse } from '../../customers/types';
import { queries } from '../graphql';

type Props = {
  contentId: string;
  contentType: string;
  target?: string;
  extraTabs: Array<{ name: string; label: string }>;
};

type FinalProps = {
  activityLogQuery: ConfLogQueryResponse;
} & WithDataProps;

class Container extends React.Component<FinalProps, {}> {
  // componentWillMount() {
  //   const { activityLogQuery } = this.props;

  //   activityLogQuery.subscribeToMore({
  //     document: gql(subscriptions.activityLogsChanged),
  //     updateQuery: () => {
  //       this.props.activityLogQuery.refetch();
  //     }
  //   });
  // }

  render() {
    const { activityLogQuery } = this.props;
    // if (activityLogQuery.loading) {
    //   return sdas
    // }
    // const logs = activityLogQuery.conformitiesForActivity;
    console.log(activityLogQuery);
    return <div />;
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
        name: 'activityLogQuery',
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
