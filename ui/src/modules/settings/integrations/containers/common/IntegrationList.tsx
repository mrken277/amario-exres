import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Spinner from 'modules/common/components/Spinner';
import { Alert, confirm } from 'modules/common/utils';
import IntegrationList from 'modules/settings/integrations/components/common/IntegrationList';
import { mutations, queries } from 'modules/settings/integrations/graphql';
import React from 'react';
import {
  ArchiveIntegrationResponse,
  CommonFieldsEditResponse,
  IntegrationsQueryResponse,
  RemoveMutationResponse
} from '../../types';
import { integrationsListParams } from '../utils';

type Props = {
  queryParams: any;
  kind?: string | null;
  variables?: { brandId?: string; channelId?: string };
  disableAction?: boolean;
  integrationsCount: number;
};

const IntegrationListContainer = (props: Props) => {
  const { kind, queryParams, variables } = props;

  const refetchQueries = [
    {
      query: gql(queries.integrations),
      variables: {
        ...props.variables,
        ...integrationsListParams(queryParams || {}),
        kind
      }
    },
    {
      query: gql(queries.integrationTotalCount)
    }
  ];

  const {
    loading: integrationsQueryLoading,
    error: integrationsQueryError,
    data: integrationsQueryData
  } = useQuery<IntegrationsQueryResponse>(gql(queries.integrations), {
    notifyOnNetworkStatusChange: true,
    variables: {
      ...variables,
      ...integrationsListParams(queryParams || {}),
      kind
    },
    fetchPolicy: 'network-only'
  }
  );

  const [removeMutation, { error: integrationsRemoveMutationError }] =
    useMutation<RemoveMutationResponse>(
      gql(mutations.integrationsRemove), { refetchQueries });

  const [archiveIntegration, { error: archiveMutationError }] =
    useMutation<ArchiveIntegrationResponse>(
      gql(mutations.integrationsArchive), { refetchQueries });

  const [editCommonFields, { error: editCommonFieldsMutationError }] =
    useMutation<CommonFieldsEditResponse>(
      gql(mutations.integrationsEditCommonFields), { refetchQueries });

  if (integrationsQueryLoading) {
    return <Spinner objective={true} />;
  }

  if (integrationsQueryError || integrationsRemoveMutationError || archiveMutationError || editCommonFieldsMutationError) {
    return <p>Error!</p>;
  }

  const integrations = integrationsQueryData ? integrationsQueryData.integrations : [];

  const removeIntegration = integration => {
    const message = `
      If you remove an integration, then all related conversations, customers & pop ups
      will also be removed.
      Are you sure?
    `;

    confirm(message).then(() => {
      Alert.warning('Removing... Please wait!!!');

      removeMutation({ variables: { _id: integration._id } })
        .then(() => {
          Alert.success('Your integration is no longer in this channel');
        })

        .catch(error => {
          Alert.error(error.message);
        });
    });
  };

  const archive = (id: string) => {
    const message = `
      If you archive an integration, then you won't be able to see customers & conversations 
      related to this integration anymore.
      Are you sure?
    `;

    confirm(message).then(() => {
      archiveIntegration({ variables: { _id: id } })
        .then(({ data }) => {
          // const integration = data.archiveIntegration;

          // if (integration && integration._id) {
          //   Alert.success('Integration has been archived.');
          // }
        })
        .catch((error: Error) => {
          Alert.error(error.message);
        });
    });
  };

  const editIntegration = (
    id: string,
    { name, brandId }: { name: string; brandId: string }
  ) => {
    if (!name && !brandId) {
      Alert.error('Name and brand must be chosen');

      return;
    }

    editCommonFields({ variables: { _id: id, name, brandId } })
      .then(({ data }) => {
        // const result = data.integrationsEditCommonFields;

        // if (result && result._id) {
        //   Alert.success('Integration has been edited.');
        // }
      })
      .catch((error: Error) => {
        Alert.error(error.message);
      });
  };

  const updatedProps = {
    ...props,
    integrations,
    removeIntegration,
    loading: integrationsQueryLoading,
    archive,
    editIntegration
  };

  return <IntegrationList {...updatedProps} />;
};

export default IntegrationListContainer;
