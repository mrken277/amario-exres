import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import ButtonMutate from 'modules/common/components/ButtonMutate';
import { IButtonMutateProps } from 'modules/common/types';
import { queries as kbQueries } from 'modules/knowledgeBase/graphql';
import { TopicsQueryResponse } from 'modules/knowledgeBase/types';
import { queries } from 'modules/settings/integrations/graphql';
import React from 'react';
import KnowledgeBase from '../../components/knowledgebase/knowledgeBase';
import { mutations } from '../../graphql';
import { IntegrationsQueryResponse } from '../../types';
import { integrationsListParams } from '../utils';

type Props = {
  queryParams: any;
  closeModal: () => void;
};

const KnowledgeBaseContainer = (props: Props) => {
  const { queryParams } = props;

  const {
    loading: integrationsQueryLoading,
    error: integrationsQueryError,
    data: integrationsQueryData
  } = useQuery<IntegrationsQueryResponse>(
    gql(queries.integrations),
    {
      notifyOnNetworkStatusChange: true,
      variables: {
        ...integrationsListParams(queryParams || {}),
        kind: 'messenger'
      },
      fetchPolicy: 'network-only'
    }
  );

  const {
    loading: topicsQueryLoading,
    error: topicsQueryError,
    data: topicsQueryData
  } = useQuery<TopicsQueryResponse>(
    gql(kbQueries.knowledgeBaseTopics));

  const integrations = integrationsQueryData ? integrationsQueryData.integrations : [];
  const topics = topicsQueryData ? topicsQueryData.knowledgeBaseTopics : [];

  if (integrationsQueryError || topicsQueryError) {
    return <p>Error!</p>;
  }

  if (integrationsQueryLoading || topicsQueryLoading) {
    return <p>Loading...</p>;
  }

  const renderButton = ({
    name,
    values,
    isSubmitted,
    callback
  }: IButtonMutateProps) => {
    return (
      <ButtonMutate
        mutation={mutations.messengerAppsAddKnowledgebase}
        variables={values}
        callback={callback}
        refetchQueries={getRefetchQueries()}
        isSubmitted={isSubmitted}
        type="submit"
        successMessage={`You successfully added a ${name}`}
      />
    );
  };

  const updatedProps = {
    ...props,
    integrations,
    topics,
    renderButton
  };

  return <KnowledgeBase {...updatedProps} />;
}

const getRefetchQueries = () => {
  return [
    {
      query: gql(queries.messengerApps),
      variables: { kind: 'knowledgebase' }
    },
    {
      query: gql(queries.messengerAppsCount),
      variables: { kind: 'knowledgebase' }
    }
  ];
};

export default KnowledgeBaseContainer;