import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Conversation from 'modules/activityLogs/components/items/Conversation';
import { IActivityLog } from 'modules/activityLogs/types';
import ErrorMsg from 'modules/common/components/ErrorMsg';
import Spinner from 'modules/common/components/Spinner';
import checkError from 'modules/common/utils/checkError';
import { queries } from 'modules/inbox/graphql';
import {
  ConversationDetailQueryResponse,
  FacebookCommentsQueryResponse,
  MessagesQueryResponse
} from 'modules/inbox/types';
import React from 'react';

type Props = {
  activity: IActivityLog;
  conversationId: string;
};

function ConversationContainer(props: Props) {

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
  } = useQuery<MessagesQueryResponse>(
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
  } = useQuery<FacebookCommentsQueryResponse>(
    gql(queries.converstationFacebookComments), {
    variables: {
      postId: conversationId,
      senderId: activity.contentId
    }
  }
  );

  if (!conversationDetailQueryData) {
    return null;
  }

  if (conversationDetailQueryError || messagesQueryError || commentsQueryError) {
    const error = checkError([conversationDetailQueryError, messagesQueryError, commentsQueryError]);

    return <ErrorMsg>{error.message}</ErrorMsg>;
  }

  if (conversationDetailQueryLoading || messagesQueryLoading || commentsQueryLoading) {
    return <Spinner objective={true} />;
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
export default ConversationContainer;

