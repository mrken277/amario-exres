import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Email from 'modules/activityLogs/components/items/email/Email';
import EngageEmail from 'modules/activityLogs/components/items/email/EngageEmail';
import { EmailDeliveryDetailQueryResponse } from 'modules/activityLogs/types';
import EmptyState from 'modules/common/components/EmptyState';
import ErrorMsg from 'modules/common/components/ErrorMsg';
import Spinner from 'modules/common/components/Spinner';
import checkError from 'modules/common/utils/checkError';
import { queries as engageQueries } from 'modules/engage/graphql';
import { EngageMessageDetailQueryResponse, IEmailDelivery } from 'modules/engage/types';
import React from 'react';
import { queries } from '../../graphql';

type Props = {
  activity: any;
  emailId: string;
  emailType: string;
};

function EmailContainer(props: Props) {
  const { emailId, emailType } = props;

  const {
    loading: engageMessageDetailQueryLoading,
    error: engageMessageDetailQueryError,
    data: engageMessageDetailQueryData
  } = useQuery<EngageMessageDetailQueryResponse>(
    gql(engageQueries.engageMessageDetail), {
    skip: emailType === 'engage',
    variables: {
      _id: emailId
    }
  }
  );

  const {
    loading: emailDeliveryDetailQueryLoading,
    error: emailDeliveryDetailQueryError,
    data: emailDeliveryDetailQueryData
  } = useQuery<EmailDeliveryDetailQueryResponse>(
    gql(queries.emailDeliveryDetail), {
    skip: emailType === 'engage',
    variables: {
      _id: emailId
    }
  });

  if (engageMessageDetailQueryError || emailDeliveryDetailQueryError) {
    const error = checkError([engageMessageDetailQueryError, emailDeliveryDetailQueryError]);

    return <ErrorMsg>{error.message}</ErrorMsg>;
  }

  if (engageMessageDetailQueryLoading || emailDeliveryDetailQueryLoading) {
    return <Spinner objective={true} />;
  }

  if (emailType === 'engage') {
    if (!engageMessageDetailQueryData || !emailDeliveryDetailQueryData) {
      return <EmptyState icon="email-4" text="Email not found" />;
    }

    return (
      <EngageEmail
        {...props}
        email={engageMessageDetailQueryData.engageMessageDetail || []}
      />
    );
  }

  const updatedProps = {
    ...props,
    email: emailDeliveryDetailQueryData ? emailDeliveryDetailQueryData.emailDeliveryDetail : {} as IEmailDelivery
  }

  return <Email {...updatedProps} />;
}

export default EmailContainer;
