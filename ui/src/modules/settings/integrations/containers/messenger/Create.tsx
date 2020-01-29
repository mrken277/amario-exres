import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Spinner from 'modules/common/components/Spinner';
import { IRouterProps } from 'modules/common/types';
import { Alert } from 'modules/common/utils';
import { queries as kbQueries } from 'modules/knowledgeBase/graphql';
import { queries as brandQueries } from 'modules/settings/brands/graphql';
import Form from 'modules/settings/integrations/components/messenger/Form';
import { integrationsListParams } from 'modules/settings/integrations/containers/utils';
import { mutations, queries } from 'modules/settings/integrations/graphql';
import {
  IMessengerData,
  IUiOptions,
  SaveMessengerAppearanceMutationResponse,
  SaveMessengerConfigsMutationResponse,
  SaveMessengerMutationResponse,
  SaveMessengerMutationVariables
} from 'modules/settings/integrations/types';
import React from 'react';
import { withRouter } from 'react-router';
import { TopicsQueryResponse } from '../../../../knowledgeBase/types';
import { AllBrandsQueryResponse } from '../../../brands/types';
import { UsersQueryResponse } from '../../../team/types';

type Props = {
  queryParams: any;
  integrationId?: string;
};

type FinalProps = {
} & Props &
  IRouterProps;

const CreateMessenger = (props: FinalProps) => {
  const { history, queryParams, integrationId } = props;

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
  } = useQuery<AllBrandsQueryResponse>(gql(brandQueries.brands),
    { fetchPolicy: 'network-only' }
  );

  const {
    loading: kbTopicsQueryLoading,
    error: kbTopicsQueryError,
    data: kbTopicsQueryData
  } = useQuery<TopicsQueryResponse>(gql(kbQueries.knowledgeBaseTopics));

  const [saveMessengerMutation, { error: saveMessengerMutationError }] =
    useMutation<SaveMessengerMutationResponse, SaveMessengerMutationVariables>(
      gql(mutations.integrationsCreateMessenger), {
      refetchQueries: [
        {
          query: gql(queries.integrations),
          variables: integrationsListParams(queryParams)
        },
        {
          query: gql(queries.integrationTotalCount)
        }
      ]
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

  if (usersQueryLoading || brandsQueryLoading || kbTopicsQueryLoading) {
    return <Spinner />;
  }

  if (usersQueryError || brandsQueryError || kbTopicsQueryError || saveMessengerMutationError || saveConfigsMutationError || saveAppearanceMutationError) {
    return <p>Error!</p>;
  }

  const users = usersQueryData ? usersQueryData.users : [];
  const brands = brandsQueryData ? brandsQueryData.brands : [];
  const topics = kbTopicsQueryData ? kbTopicsQueryData.knowledgeBaseTopics : [];

  const save = doc => {
    const { name, brandId, languageCode, messengerData, uiOptions } = doc;
    saveMessengerMutation({
      variables: { name, brandId, languageCode }
    })
      .then(({ data }) => {
        // const id = data.integrationsCreateMessengerIntegration._id;

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
      .then(
        ({
          // data: {
          //   integrationsSaveMessengerAppearanceData: { _id }
          // }
        }) => {
          Alert.success('You successfully added an integration');
          history.push(
            `/settings/integrations?refetch=true&_id=''&kind=messenger`
          );
        }
      )
      .catch(error => {
        Alert.error(error.message);
      });
  };

  const updatedProps = {
    ...props,
    teamMembers: users || [],
    brands,
    save,
    topics
  };

  return <Form {...updatedProps} />;
};

export default withRouter<FinalProps>(CreateMessenger);
