import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Bulk from 'modules/common/components/Bulk';
import ErrorMsg from 'modules/common/components/ErrorMsg';
import Spinner from 'modules/common/components/Spinner';
import { Alert, confirm } from 'modules/common/utils';
import checkError from 'modules/common/utils/checkError';
import { generatePaginationParams } from 'modules/common/utils/router';
import { mutations as integrationMutations } from 'modules/settings/integrations/graphql/index';
import { ArchiveIntegrationResponse } from 'modules/settings/integrations/types';
import React from 'react';
import { TagsQueryResponse } from '../../tags/types';
import List from '../components/List';
import { mutations, queries } from '../graphql';
import {
  CountQueryResponse,
  LeadIntegrationsQueryResponse,
  RemoveMutationResponse,
  RemoveMutationVariables
} from '../types';

type Props = {
  queryParams: any;
};

function ListContainer(props: Props) {
  const {
    queryParams
  } = props;

  const {
    error: integrationsError,
    loading: integrationsLoading,
    data: integrationsData,
    refetch: integrationsRefetch
  } = useQuery<LeadIntegrationsQueryResponse, { page?: number; perPage?: number; tag?: string; kind?: string }>(gql(queries.integrations), {
    variables: {
      ...generatePaginationParams(queryParams),
      tag: queryParams.tag,
      kind: 'lead'
    }
  });

  const {
    error: integrationsTotalCountError,
    loading: integrationsTotalCountLoading,
    data: integrationsTotalCountData,
    refetch: integrationsTotalCountRefetch
  } = useQuery<CountQueryResponse>(gql(queries.integrationsTotalCount));

  const {
    error: tagsError,
    loading: tagsLoading,
    data: tagsData
  } = useQuery<TagsQueryResponse, { type: string }>(gql(queries.tags), {
    variables: {
      type: 'integration'
    }
  });

  const [removeMutation,
    { error: removeError,
      loading: removeLoading,
      data: removeData
    }] = useMutation<RemoveMutationResponse, RemoveMutationVariables>(gql(mutations.integrationRemove));

  const [archiveIntegration,
    { error: archiveIntegrationError,
      loading: archiveIntegrationLoading,
      data: archiveIntegrationData
    }] = useMutation<ArchiveIntegrationResponse>(gql(integrationMutations.integrationsArchive));

  if (!integrationsTotalCountData) {
    return null;
  };

  if (integrationsError || tagsError || integrationsTotalCountError) {
    const error = checkError([integrationsError, tagsError, integrationsTotalCountError]);

    return <ErrorMsg>{error.message}</ErrorMsg>;
  };

  if (tagsLoading || integrationsTotalCountLoading || archiveIntegrationLoading || removeLoading) {
    return <Spinner objective={true} />;
  }

  const counts = (integrationsTotalCountData && integrationsTotalCountData.integrationsTotalCount) || {
    byKind: {}
  };
  const totalCount = counts.byKind.lead || 0;
  const tagsCount = counts.byTag || {};

  const integrations = (integrationsData && integrationsData.integrations) || [];

  const refetch = () => {
    integrationsRefetch();
    integrationsTotalCountRefetch();
  };

  const remove = (integrationId: string) => {
    const message = `
      If you remove a pop ups, then all related conversations, customers will also be removed.
      Are you sure?
    `;

    confirm(message).then(() => {
      removeMutation({
        variables: { _id: integrationId }
      })

      if (removeData) {
        // refresh queries
        refetch();

        Alert.success('You successfully deleted a pop ups.');
      }

      if (removeError) {
        Alert.error(removeError.message);
      }
    });
  };

  const archive = (integrationId: string) => {
    const message = `
      If you archive a pop ups, then you won't be able to see customers & conversations 
      related to this pop ups anymore.
      Are you sure?
    `;

    confirm(message).then(() => {
      archiveIntegration({ variables: { _id: integrationId } })

      if (archiveIntegrationData) {
        const integration = archiveIntegrationData;

        if (integration) {
          Alert.success('Pop ups has been archived.');
        }

        refetch();
      }

      if (archiveIntegrationError) {
        Alert.error(archiveIntegrationError.message);
      }
    });
  };

  const updatedProps = {
    ...props,
    integrations,
    remove,
    loading: integrationsLoading,
    totalCount,
    tagsCount,
    tags: (tagsData && tagsData.tags) || [],
    archive
  };

  const content = upprops => {
    return <List {...updatedProps} {...upprops} />;
  };

  return <Bulk content={content} refetch={refetch} />;
}

export default ListContainer;
