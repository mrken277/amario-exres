import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import EmptyState from 'modules/common/components/EmptyState';
import ErrorMsg from 'modules/common/components/ErrorMsg';
import Spinner from 'modules/common/components/Spinner';
import React from 'react';
import EmailStatistics from '../components/EmailStatistics';
import { queries } from '../graphql';
import { EngageMessageDetailQueryResponse, IEngageMessage } from '../types';

type Props = {
  messageId: string;
};

function EmailStatisticsContainer(props: Props) {
  const { messageId } = props;

  const {
    data: engageMessageDetailData,
    error: engageMessageDetailError,
    loading: engageMessageDetailLoading
  } = useQuery<EngageMessageDetailQueryResponse, { _id: string }>(
    gql(queries.engageMessageStats), {
    variables: {
      _id: messageId
    }
  });

  if (engageMessageDetailError) {
    return <ErrorMsg>{engageMessageDetailError.message}</ErrorMsg>;
  };

  if (engageMessageDetailLoading) {
    return <Spinner objective={true} />;
  };

  if (!engageMessageDetailData) {
    return (
      <EmptyState size="full" text="Message not found" icon="web-section-alt" />
    );
  }

  const message = engageMessageDetailData ? engageMessageDetailData.engageMessageDetail : {} as IEngageMessage;

  return <EmailStatistics message={message} {...props} />;
}

export default EmailStatisticsContainer;