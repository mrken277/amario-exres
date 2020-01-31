import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Spinner from 'modules/common/components/Spinner';
import { Alert } from 'modules/common/utils';
import {
  AddIntegrationMutationResponse,
  AddIntegrationMutationVariables
} from 'modules/settings/integrations/types';
import { AddFieldsMutationResponse } from 'modules/settings/properties/types';
import React, { useState } from 'react';
import { withRouter } from 'react-router';
import { IRouterProps } from '../../common/types';
import Lead from '../components/Lead';
import { mutations } from '../graphql';
import { ILeadData } from '../types';

type Props = {} & IRouterProps &
  AddIntegrationMutationResponse &
  AddFieldsMutationResponse;

type State = {
  isLoading: boolean;
  isReadyToSaveForm: boolean;
  leadDoc?: {
    brandId: string;
    name: string;
    languageCode: string;
    lead: any;
    leadData: ILeadData;
  };
};

function CreateLeadContainer(props: Props, state: State) {
  const [isloadingLeads, setLoadingLeads] = useState(false);
  const [isReadyToSaveForm, setReadyToSaveForm] = useState(false);
  // see you again!!!
  const [leadDoc, setDoc] = useState(state.leadDoc);

  const { history } = props;

  const [addIntegrationMutation,
    { data: leadsQueryData,
      loading: leadsLoading,
      error: leadsQueryError
    }] = useMutation<AddIntegrationMutationResponse, AddIntegrationMutationVariables>(gql(mutations.integrationsCreateLeadIntegration), {
      refetchQueries: ['leadIntegrations', 'leadIntegrationCounts']
    });

  if (leadsLoading) {
    return <Spinner objective={true} />;
  };

  const afterFormDbSave = id => {
    setReadyToSaveForm(false);

    if (leadDoc) {
      const { leadData, brandId, name, languageCode } = leadDoc;

      addIntegrationMutation({
        variables: {
          formId: id,
          leadData,
          brandId,
          name,
          languageCode
        }
      });

      if (leadsQueryData) {
        Alert.success('You successfully added a lead');
        history.push('/leads');

        setLoadingLeads(false);
      };

      if (leadsQueryError) {
        Alert.error(leadsQueryError.message);

        setLoadingLeads(false);
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
    fields: [],
    save,
    afterFormDbSave,
    isActionLoading: isloadingLeads,
    isReadyToSaveForm
  };

  return <Lead {...updatedProps} />;
}

export default withRouter<Props>(CreateLeadContainer);
