import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import ButtonMutate from 'modules/common/components/ButtonMutate';
import Spinner from 'modules/common/components/Spinner';
import { IButtonMutateProps } from 'modules/common/types';
import { queries } from 'modules/settings/integrations/graphql';
import React from 'react';
import Website from '../../components/website/website';
import { mutations } from '../../graphql';
import { IntegrationsQueryResponse } from '../../types';
import { integrationsListParams } from '../utils';

const getRefetchQueries = () => {
  return [
    {
      query: gql(queries.messengerApps),
      variables: { kind: 'website' }
    },
    {
      query: gql(queries.messengerAppsCount),
      variables: { kind: 'website' }
    }
  ];
};

type Props = {
  queryParams: any;
  closeModal: () => void;
};

const WebsiteContainer = (props: Props) => {
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

  if (integrationsQueryError) {
    return <p>Error!</p>;
  }

  if (integrationsQueryLoading) {
    return <Spinner objective={true} />;
  }

  const integrations = integrationsQueryData ? integrationsQueryData.integrations : [];

  const renderButton = ({
    name,
    values,
    isSubmitted,
    callback
  }: IButtonMutateProps) => {
    return (
      <ButtonMutate
        mutation={mutations.messengerAppsAddWebsite}
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
    renderButton
  };

  return <Website {...updatedProps} />;
}

export default WebsiteContainer;
