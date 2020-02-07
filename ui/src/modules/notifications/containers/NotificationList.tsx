import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import ErrorMsg from 'modules/common/components/ErrorMsg';
import Spinner from 'modules/common/components/Spinner';
import { IQueryParams } from 'modules/common/types';
import { Alert } from 'modules/common/utils';
import checkError from 'modules/common/utils/checkError';
import { generatePaginationParams } from 'modules/common/utils/router';
import React from 'react';
import { useMutation } from 'react-apollo';
import NotificationList from '../components/NotificationList';
import { mutations, queries } from '../graphql';
import {
  MarkAsReadMutationResponse,
  NotificationsCountQueryResponse,
  NotificationsQueryResponse
} from '../types';

type Props = {
  queryParams: IQueryParams;
};

function NotificationListContainer(props: Props) {
  const { queryParams } = props;

  const {
    data: notificationsData,
    error: notificationsError,
    loading: notificationsLoading,
    refetch: notificationsRefetch
  } = useQuery<NotificationsQueryResponse, { requireRead: boolean; page?: number; perPage?: number; title?: string }>(
    gql(queries.notifications), {
    variables: {
      ...generatePaginationParams(queryParams),
      requireRead: queryParams.requireRead === 'true' ? true : false,
      title: queryParams.title
    }
  });

  const {
    data: notificationCountData,
    error: notificationCountError,
    loading: notificationCountLoading,
    refetch: notificationsCountRefetch
  } = useQuery<NotificationsCountQueryResponse>(
    gql(queries.notificationCounts), {
    variables: {
      requireRead: queryParams.requireRead === 'true' ? true : false
    }
  });

  const [notificationsMarkAsReadMutation,
    {
      data: markAsReadData,
      error: markAsReadError,
      loading: markAsReadLoading
    }] = useMutation<MarkAsReadMutationResponse, { _ids?: string[] }>(
      gql(mutations.markAsRead), {
      refetchQueries: [
        {
          query: gql(queries.notifications),
          variables: {
            limit: 10,
            requireRead: false
          }
        },
        'notificationCounts'
      ]
    });

  if (notificationCountError || notificationsError) {
    const error = checkError([notificationCountError, notificationsError])
    return <ErrorMsg>{error.message}</ErrorMsg>;
  }

  if (markAsReadLoading || notificationCountLoading) {
    return <Spinner objective={true} />;
  }

  const markAsRead = (notificationIds?: string[]) => {
    notificationsMarkAsReadMutation({
      variables: { _ids: notificationIds }
    })
    if (markAsReadData) {
      if (notificationsRefetch) {
        notificationsRefetch();
        notificationsCountRefetch();
      }

      Alert.success('Notification have been seen');
    }
    if (markAsReadError) {
      Alert.error(markAsReadError.message);
    };
  };

  const updatedProps = {
    ...props,
    markAsRead,
    notifications: notificationsData ? notificationsData.notifications : [],
    count: notificationCountData ? notificationCountData.notificationCounts : 0,
    loading: notificationsLoading
  };

  return <NotificationList {...updatedProps} />;
}

export default NotificationListContainer;