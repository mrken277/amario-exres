import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Spinner from 'modules/common/components/Spinner';
import React from 'react';
import EmailForm from '../components/EmailForm';
import { queries } from '../graphql';
import { EngageVerifiedEmailsQueryResponse, IEmailFormProps } from '../types';

type Props = IEmailFormProps;

function ConversationContainer(props: Props) {

  const {
    loading: engageVerifiedEmailsLoading,
    error: engageVerifiedEmailsError,
    data: engageVerifiedEmailsData
  } = useQuery<EngageVerifiedEmailsQueryResponse>(
    gql(queries.verifiedEmails));

  const verifiedEmails = (engageVerifiedEmailsData && engageVerifiedEmailsData.engageVerifiedEmails) || [];
  const error = engageVerifiedEmailsError;

  if (engageVerifiedEmailsLoading) {
    return <Spinner objective={true} />;
  };

  const updatedProps = {
    ...props,
    error: error && error.message,
    verifiedEmails
  };

  return <EmailForm {...updatedProps} />;
}

export default ConversationContainer;