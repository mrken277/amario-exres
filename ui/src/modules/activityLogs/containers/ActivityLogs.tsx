import { useQuery } from '@apollo/react-hooks';
import { AppConsumer } from 'appContext';
import gql from 'graphql-tag';
import { IUser } from 'modules/auth/types';
import ErrorMsg from 'modules/common/components/ErrorMsg';
import checkError from 'modules/common/utils/checkError';
import React, { useState } from 'react';
import { ActivityLogQueryResponse } from '../../customers/types';
import ActivityLogs from '../components/ActivityLogs';
import { queries, subscriptions } from '../graphql';

type Props = {
  contentId: string;
  contentType: string;
  target?: string;
  extraTabs: Array<{ name: string; label: string }>;
  activityType: string;
};

type State = {
  activityType: ''
};

export function ActivityContainer(props: Props, state: State, currentTab: string) {
  const { contentId, contentType, target, extraTabs } = props;

  const [activityType, setActivityType] = useState(currentTab);

  const onChangeActivityTab = () => {
    setActivityType(currentTab)
  };

  type WithDataProps = Props & {
    onChangeActivityTab: (currentTab: string) => void;
    activityType: string;
  };

  const {
    data: ActivityLogQueryData,
    error: ActivityLogQueryError,
    loading: ActivityLogQueryLoading
  } = useQuery<WithDataProps, ActivityLogQueryResponse>(
    gql(queries.activityLogs), {
    variables: {
      contentId,
      contentType,
      activityType: activityType === 'activity' ? '' : activityType
    }
  }
  );

  if (ActivityLogQueryError) {
    const error = checkError([ActivityLogQueryError]);
    return <ErrorMsg>{error.message}</ErrorMsg>;
  };

  UNSAFE_componentWillMount() {
    ActivityLogQueryData.subscribeToMore({
      document: gql(subscriptions.activityLogsChanged),
      updateQuery: () => {
        ActivityLogQueryData.refetch();
      }
    });
  }

  const updateprops = {
    target,
    loadingLogs: ActivityLogQueryLoading,
    activityLogs: ActivityLogQueryData && ActivityLogQueryData.activityLogs || [],
    onTabClick: onChangeActivityTab,
    extraTabs
  };

  return (
    <AppConsumer>
      {({ currentUser }) => (
        <ActivityLogs {...updateprops} currentUser={currentUser || ({} as IUser)} />
      )}
    </AppConsumer>
  );
};

return (
  <ActivityContainer
    target={target}
    contentId={contentId}
    contentType={contentType}
    extraTabs={extraTabs}
    activityType={activityType}
    onChangeActivityTab={onChangeActivityTab}
  />
);




