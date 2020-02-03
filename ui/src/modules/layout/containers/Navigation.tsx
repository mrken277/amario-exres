import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { IUser } from 'modules/auth/types';
import ErrorMsg from 'modules/common/components/ErrorMsg';
import Spinner from 'modules/common/components/Spinner';
import { queries, subscriptions } from 'modules/inbox/graphql';
import React, { useEffect } from 'react';
import strip from 'strip';
import { sendDesktopNotification } from '../../common/utils';
import Navigation from '../components/Navigation';

type FinalProps = {
  currentUser: IUser;
};

function NavigationContainer(props: FinalProps) {
  const { currentUser } = props;
  const {
    data: unreadConversationsCountData,
    error: unreadConversationsCountError,
    loading: unreadConversationsCountLoading,
    refetch: unreadConversationsCountRefetch,
    subscribeToMore
  } = useQuery(gql(queries.unreadConversationsCount), {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true
  }
  );

  useEffect(() => {
    subscribeToMore({
      // listen for all conversation changes
      document: gql(subscriptions.conversationClientMessageInserted),
      variables: { userId: currentUser._id },
      updateQuery: (prev, { subscriptionData: { data } }) => {
        const { conversationClientMessageInserted } = data;
        const { content } = conversationClientMessageInserted;

        unreadConversationsCountRefetch();

        sendDesktopNotification({
          title: 'You have a new message',
          content: strip(content || '')
        });
      }
    });
  });

  if (unreadConversationsCountError) {
    return <ErrorMsg>{unreadConversationsCountError.message}</ErrorMsg>;
  }

  if (unreadConversationsCountLoading) {
    return <Spinner objective={true} />;
  };

  const unreadConversationsCount =
    unreadConversationsCountData ? unreadConversationsCountData.conversationsTotalUnreadCount : 0;

  const updateprops = {
    unreadConversationsCount
  };

  return <Navigation {...updateprops} />;

}

export default NavigationContainer;