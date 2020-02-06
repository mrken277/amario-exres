import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Spinner from 'modules/common/components/Spinner';
import { IButtonMutateProps } from 'modules/common/types';
import { queries as kbQueries } from 'modules/knowledgeBase/graphql';
import { TopicsQueryResponse } from 'modules/knowledgeBase/types';
import { queries as integrationQueries } from 'modules/settings/integrations/graphql';
import { IntegrationsQueryResponse } from 'modules/settings/integrations/types';
import React from 'react';
import { ICommonFormProps } from '../../common/types';
import Form from '../components/Form';

type Props = {
  renderButton: (props: IButtonMutateProps) => JSX.Element;
};

const FormContainer = (props: Props & ICommonFormProps) => {
  const {
    loading: integrationsQueryLoading,
    error: integrationsQueryError,
    data: integrationsQueryData
  } = useQuery<IntegrationsQueryResponse>(gql(integrationQueries.integrations));

  const {
    loading: kbTopicsQueryLoading,
    error: kbTopicsQueryError,
    data: kbTopicsQueryData
  } = useQuery<TopicsQueryResponse>(gql(kbQueries.knowledgeBaseTopics));

  if (integrationsQueryLoading || kbTopicsQueryLoading) {
    return <Spinner objective={true} />;
  }

  if (integrationsQueryError || kbTopicsQueryError) {
    return <p>Error!</p>;
  }

  const integrations = integrationsQueryData ? integrationsQueryData.integrations : [];
  const kbTopics = kbTopicsQueryData ? kbTopicsQueryData.knowledgeBaseTopics : [];

  const updatedProps = {
    ...props,
    messengers: integrations.filter(i => i.kind === 'messenger'),
    leads: integrations.filter(i => i.kind === 'lead'),
    kbTopics
  };

  return <Form {...updatedProps} />;
};

export default FormContainer;
