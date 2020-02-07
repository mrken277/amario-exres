import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import ButtonMutate from 'modules/common/components/ButtonMutate';
import Spinner from 'modules/common/components/Spinner';
import { IButtonMutateProps } from 'modules/common/types';
import { queries } from 'modules/settings/integrations/graphql';
import React from 'react';
import Lead from '../../components/lead/Lead';
import { mutations } from '../../graphql';
import { IntegrationsQueryResponse } from '../../types';
import { integrationsListParams } from '../utils';

type Props = {
  queryParams: any;
  closeModal: () => void;
};

const LeadContainer = (props: Props) => {
  const { queryParams } = props;

  const {
    loading: integrationsQueryLoading,
    error: integrationsQueryError,
    data: integrationsQueryData
  } = useQuery<IntegrationsQueryResponse>(gql(queries.integrations),
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
    loading: leadIntegrationsQueryLoading,
    error: leadIntegrationsQueryError,
    data: leadIntegrationsQueryData
  } = useQuery<IntegrationsQueryResponse>(gql(queries.integrations), {
    notifyOnNetworkStatusChange: true,
    variables: {
      ...integrationsListParams(queryParams || {}),
      kind: 'lead'
    },
    fetchPolicy: 'network-only'
  });

  const integrations = integrationsQueryData ? integrationsQueryData.integrations : [];
  const leads = leadIntegrationsQueryData ? leadIntegrationsQueryData.integrations : [];

  if (integrationsQueryError || leadIntegrationsQueryError) {
    return <p>Error!</p>;
  }

  if (integrationsQueryLoading || leadIntegrationsQueryLoading) {
    return <Spinner objective={true} />;
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
    leads,
    renderButton
  };

  return <Lead {...updatedProps} />;
}

const getRefetchQueries = () => {
  return [
    {
      query: gql(queries.messengerApps),
      variables: { kind: 'lead' }
    },
    {
      query: gql(queries.messengerAppsCount),
      variables: { kind: 'lead' }
    }
  ];
};

export default LeadContainer;
