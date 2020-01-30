import { useQuery } from '@apollo/react-hooks';
import { AppConsumer } from 'appContext';
import gql from 'graphql-tag';
import { IUser } from 'modules/auth/types';
import ErrorMsg from 'modules/common/components/ErrorMsg';
import Spinner from 'modules/common/components/Spinner';
import React, { useEffect, useState } from 'react';
import ActivityLogs from '../components/ActivityLogs';
import { queries, subscriptions } from '../graphql';

type Props = {
  contentId: string;
  contentType: string;
  target?: string;
  extraTabs: Array<{ name: string; label: string }>;
};

type WithDataProps = Props & {
  onChangeActivityTab: (currentTab: string) => void;
  activityType: string;
};

export const ActivityLogContainer = (props: WithDataProps) => {
  const {
    target,
    onChangeActivityTab,
    extraTabs,
    contentId,
    contentType,
    activityType
  } = props;

  const {
    data: ActivityLogData,
    error: ActivityLogError,
    loading: ActivityLogLoading,
    refetch: ActivityLogRefetch,
    subscribeToMore
  } = useQuery(gql(queries.activityLogs), {
    variables: {
      contentId,
      contentType,
      activityType: activityType === 'activity' ? '' : activityType
    }
  }
  );

  useEffect(() => {
    subscribeToMore({
      document: gql(subscriptions.activityLogsChanged),
      updateQuery: () => {
        ActivityLogRefetch();
      }
    });
  });

  if (ActivityLogError) {
    return <ErrorMsg>{ActivityLogError.message}</ErrorMsg>;
  }

  if (ActivityLogLoading) {
    return <Spinner objective={true} />;
  }

  const updatedProps = {
    target,
    loadingLogs: ActivityLogLoading,
    activityLogs: ActivityLogData ? ActivityLogData.activityLogs : [],
    onTabClick: onChangeActivityTab,
    extraTabs
  };

  return (
    <AppConsumer>
      {({ currentUser }) => (
        <ActivityLogs {...updatedProps} currentUser={currentUser || ({} as IUser)} />
      )}
    </AppConsumer>
  );
}

const Wrapper = (props: Props) => {
  const [activityType, setActivityType] = useState('');

  const { contentId, contentType, target, extraTabs } = props;

  const onChangeActivityTab = (currentTab: string) => {
    setActivityType(currentTab)
  };

  return (
    <ActivityLogContainer
      target={target}
      contentId={contentId}
      contentType={contentType}
      extraTabs={extraTabs}
      activityType={activityType}
      onChangeActivityTab={onChangeActivityTab}
    />
  );
}

export default Wrapper;