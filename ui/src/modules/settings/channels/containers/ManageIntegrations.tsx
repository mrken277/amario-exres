import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Alert } from 'modules/common/utils';
import ManageIntegrations from 'modules/settings/integrations/containers/common/ManageIntegrations';
import { integrationsListParams } from 'modules/settings/integrations/containers/utils';
import { queries as integQueries } from 'modules/settings/integrations/graphql';
import React from 'react';
import { mutations, queries } from '../graphql';
import {
  EditChannelMutationResponse,
  EditChannelMutationVariables,
  IChannelDoc
} from '../types';

type Props = {
  currentChannel: IChannelDoc;
  queryParams: any;
};

const ManageIntegrationsContainer = (props: Props) => {
  const { currentChannel, queryParams } = props;

  const [editMutation, { error: editMutationError }] =
    useMutation<EditChannelMutationResponse, EditChannelMutationVariables>(
      gql(mutations.channelEdit), {
      refetchQueries: [
        {
          query: gql(integQueries.integrations),
          variables: {
            channelId: currentChannel._id,
            ...integrationsListParams(queryParams)
          }
        },
        {
          query: gql(queries.channelDetail),
          variables: { _id: currentChannel._id }
        },
        {
          query: gql(queries.integrationsCount),
          variables: { channelId: currentChannel._id }
        }
      ]
    }
    );


  const save = (integrationIds: string[]): Promise<any> => {
    return editMutation({
      variables: {
        _id: currentChannel._id,
        name: currentChannel.name,
        integrationIds,
        memberIds: currentChannel.memberIds
      }
    })
      .then(() => {
        Alert.success('You successfully managed an integration');
      })
      .catch(e => {
        Alert.error(e.message);
      });
  };

  if (editMutationError) {
    return <p>Error!</p>;
  }

  const updatedProps = {
    ...props,
    current: currentChannel,
    save
  };

  return <ManageIntegrations {...updatedProps} />;
}

export default ManageIntegrationsContainer;
