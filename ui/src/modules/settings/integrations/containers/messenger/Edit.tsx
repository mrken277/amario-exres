import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Spinner from 'modules/common/components/Spinner';
import { IRouterProps } from 'modules/common/types';
import { Alert } from 'modules/common/utils';
import { queries as kbQueries } from 'modules/knowledgeBase/graphql';
import Form from 'modules/settings/integrations/components/messenger/Form';
import { mutations, queries } from 'modules/settings/integrations/graphql';
import {
  EditMessengerMutationResponse,
  EditMessengerMutationVariables,
  IIntegration,
  IMessengerData,
  IntegrationDetailQueryResponse,
  IUiOptions,
  SaveMessengerAppearanceMutationResponse,
  SaveMessengerConfigsMutationResponse
} from 'modules/settings/integrations/types';
import React from 'react';
import { withRouter } from 'react-router';
import { TopicsQueryResponse } from '../../../../knowledgeBase/types';
import { BrandsQueryResponse } from '../../../brands/types';
import { UsersQueryResponse } from '../../../team/types';

type Props = {
  integrationId: string;
};

type FinalProps = {
  usersQuery: UsersQueryResponse;
  brandsQuery: BrandsQueryResponse;
  integrationDetailQuery: IntegrationDetailQueryResponse;
  knowledgeBaseTopicsQuery: TopicsQueryResponse;
} & Props &
  SaveMessengerConfigsMutationResponse &
  SaveMessengerAppearanceMutationResponse &
  EditMessengerMutationResponse &
  IRouterProps;

const EditMessenger = (props: FinalProps) => {
  const { history, integrationId } = props;

  const commonRefetch = [{
    query: gql(queries.integrationDetail),
    variables: { _id: integrationId || '' },
    fetchPolicy: 'network-only'
  }]

  const {
    loading: usersQueryLoading,
    error: usersQueryError,
    data: usersQueryData
  } = useQuery<UsersQueryResponse>(gql(queries.users));

  const {
    loading: brandsQueryLoading,
    error: brandsQueryError,
    data: brandsQueryData
  } = useQuery<BrandsQueryResponse>(gql(queries.brands),
    { fetchPolicy: 'network-only' }
  );

  const {
    loading: kbTopicsQueryLoading,
    error: kbTopicsQueryError,
    data: kbTopicsQueryData
  } = useQuery<TopicsQueryResponse>(gql(kbQueries.knowledgeBaseTopics));

  const {
    loading: integrationDetailQueryLoading,
    error: integrationDetailQueryError,
    data: integrationDetailQueryData
  } = useQuery<IntegrationDetailQueryResponse, { _id: string }>(gql(queries.integrationDetail),
    {
      variables: { _id: integrationId || '' },
      fetchPolicy: 'network-only'
    }
  );

  const [editMessengerMutation, { error: editMessengerMutationError }] =
    useMutation<EditMessengerMutationResponse, EditMessengerMutationVariables>(
      gql(mutations.integrationsEditMessenger), {
      refetchQueries: commonRefetch
    });

  const [saveConfigsMutation, { error: saveConfigsMutationError }] =
    useMutation<SaveMessengerConfigsMutationResponse, { _id: string; messengerData: IMessengerData }>(
      gql(mutations.integrationsSaveMessengerConfigs), {
      refetchQueries: commonRefetch
    });

  const [saveAppearanceMutation, { error: saveAppearanceMutationError }] =
    useMutation<SaveMessengerAppearanceMutationResponse, { _id: string; uiOptions: IUiOptions }>(
      gql(mutations.integrationsSaveMessengerAppearance), {
      refetchQueries: commonRefetch
    });

  if (usersQueryLoading || brandsQueryLoading || kbTopicsQueryLoading || integrationDetailQueryLoading) {
    return <Spinner />;
  }

  if (usersQueryError || brandsQueryError || kbTopicsQueryError || editMessengerMutationError || saveConfigsMutationError || saveAppearanceMutationError || integrationDetailQueryError) {
    return <p>Error!</p>;
  }

  const users = usersQueryData ? usersQueryData.users : [];
  const brands = brandsQueryData ? brandsQueryData.brands : [];
  const topics = kbTopicsQueryData ? kbTopicsQueryData.knowledgeBaseTopics : [];
  const integration = integrationDetailQueryData ? integrationDetailQueryData.integrationDetail : {} as IIntegration;

  const save = doc => {
    const { name, brandId, languageCode, messengerData, uiOptions } = doc;
    editMessengerMutation({
      variables: { _id: integrationId, name, brandId, languageCode }
    })
      .then(({ data }) => {
        // const id = data.integrationsEditMessengerIntegration._id;

        return saveConfigsMutation({
          variables: { _id: '', messengerData }
        });
      })

      .then(({ data }) => {
        // const id = data.integrationsSaveMessengerConfigs._id;

        return saveAppearanceMutation({
          variables: { _id: '', uiOptions }
        });
      })

      .then(() => {
        Alert.success('You successfully updated a messenger');

        history.push('/settings/integrations?refetch=true');
      })
      .catch(error => {
        Alert.error(error.message);
      });
  };

  const updatedProps = {
    ...props,
    teamMembers: users || [],
    brands,
    save,
    topics,
    integration
  };

  return <Form {...updatedProps} />;
};

export default withRouter<FinalProps>(EditMessenger);
