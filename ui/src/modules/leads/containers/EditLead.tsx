import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import ErrorMsg from 'modules/common/components/ErrorMsg';
import { Alert } from 'modules/common/utils';
import {
  EditIntegrationMutationResponse,
  EditIntegrationMutationVariables,
  LeadIntegrationDetailQueryResponse
} from 'modules/settings/integrations/types';
import React, { useState } from 'react';
import Lead from '../components/Lead';
import { mutations, queries } from '../graphql';
import { ILeadData } from '../types';

type Props = {
  contentTypeId: string;
  formId: string;
  queryParams: any;
  history?: any;
};

type State = {
  isloadingLeads: boolean;
  isReadyToSave: boolean;
  leadDoc?: {
    brandId: string;
    name: string;
    languageCode: string;
    lead: any;
    leadData: ILeadData;
  };
};

function EditLeadContainer(props: Props, state: State) {
  const { contentTypeId, formId, history } = props;
  const [isloadingLeads, setLoadingLeads] = useState(false);
  const [isReadyToSave, setReadyToSaveForm] = useState(false);
  const [leadDoc, setDoc] = useState(state.leadDoc);

  const
    { loading: integrationDetailQueryLoading,
      data: integrationDetailQueryData,
      error: integrationDetailQueryError
    } = useQuery<LeadIntegrationDetailQueryResponse, { _id: string }>(gql(queries.integrationDetail), {
      variables: {
        _id: contentTypeId
      }
    });

  const [editIntegrationMutation,
    { data: editIntegrationMutationData,
      error: editIntegrationMutationError
    }] = useMutation<EditIntegrationMutationResponse, EditIntegrationMutationVariables>(gql(mutations.integrationsEditLeadIntegration), {
      refetchQueries: [
        'leadIntegrations',
        'leadIntegrationCounts',
        'formDetail'
      ]
    });

  if (!integrationDetailQueryData) {
    return null;
  };

  if (integrationDetailQueryLoading) {
    return false;
  }

  if (integrationDetailQueryError) {
    return <ErrorMsg>{integrationDetailQueryError.message}</ErrorMsg>;
  }

  const integration = integrationDetailQueryData.integrationDetail || {};

  const afterFormDbSave = () => {
    if (leadDoc) {
      const { leadData, brandId, name, languageCode } = leadDoc;

      editIntegrationMutation({
        variables: {
          _id: integration._id,
          formId,
          leadData,
          brandId,
          name,
          languageCode
        }
      })
      if (editIntegrationMutationData) {
        Alert.success('You successfully updated a lead');

        history.push('/leads');

        setLoadingLeads(false);
        setReadyToSaveForm(false);
      }

      if (editIntegrationMutationError) {
        Alert.error(editIntegrationMutationError.message);

        setLoadingLeads(false);
        setReadyToSaveForm(false);
      };
    }
  };

  const save = doc => {
    setLoadingLeads(true);
    setReadyToSaveForm(true);
    setDoc(doc);
  };

  const updatedProps = {
    ...props,
    integration,
    save,
    afterFormDbSave,
    isActionLoading: isloadingLeads,
    isReadyToSaveForm: isReadyToSave
  };

  return <Lead {...updatedProps} />;
}
export default EditLeadContainer;