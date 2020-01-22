import gql from 'graphql-tag';
import Conversation from 'modules/activityLogs/components/items/Conversation';
import { IActivityLog } from 'modules/activityLogs/types';
import Spinner from 'modules/common/components/Spinner';
import { queries } from 'modules/inbox/graphql';
import {
  ConversationDetailQueryResponse,
  FacebookCommentsQueryResponse,
  MessagesQueryResponse
} from 'modules/inbox/types';
import React from 'react';
import { useQuery } from 'react-apollo';

type Props = {
  activity: IActivityLog;
  conversationId: string;
};

export default (props: Props) => { 

  const { conversationId, activity } = props;

  const {
    loading: conversationDetailQueryLoading,
    error: conversationDetailQueryError,
    data: conversationDetailQueryData
  } = useQuery<ConversationDetailQueryResponse>(
    gql(queries.conversationDetail), {
      variables: {
        _id: conversationId
      }
    }
  );

  const {
    loading: messagesQueryLoading,
    error: messagesQueryError,
    data: messagesQueryData
  } = useQuery<MessagesQueryResponse> (
    gql(queries.conversationMessages), {
      variables: {
        conversationId,
        limit: 10,
        getFirst: true
      }
    }
  );

  const {
    loading: commentsQueryLoading,
    error: commentsQueryError,
    data: commentsQueryData
  } = useQuery<FacebookCommentsQueryResponse> (
    gql(queries.converstationFacebookComments), {
      variables: {
        postId: conversationId,
        senderId: activity.contentId
      }
    }
  );

  if (conversationDetailQueryError || messagesQueryError || commentsQueryError) {
    return <p>Error!</p>;
  }

  if (!conversationDetailQueryData || conversationDetailQueryLoading || messagesQueryLoading || commentsQueryLoading) {
    return <Spinner />;
  }

  const conversation = conversationDetailQueryData.conversationDetail;
  const messages = messagesQueryData ? messagesQueryData.conversationMessages : [];
  const comments =
    commentsQueryData ? commentsQueryData.converstationFacebookComments : [];

  const updatedProps = {
    ...props,
    conversation,
    messages,
    comments
  };

  return <Conversation {...updatedProps} />;

}
 
