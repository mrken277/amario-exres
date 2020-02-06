import { useMutation, useQuery } from '@apollo/react-hooks';
import { getEnv } from 'apolloClient';
import gql from 'graphql-tag';
import Spinner from 'modules/common/components/Spinner';
import { IFormProps } from 'modules/common/types';
import { Alert } from 'modules/common/utils';
import { mutations, queries } from 'modules/settings/integrations/graphql';
import React from 'react';
import Accounts from '../components/Accounts';
import {
  AccountsQueryResponse,
  IntegrationTypes,
  RemoveAccountMutationResponse
} from '../types';

type Props = {
  kind: IntegrationTypes;
  addLink: string;
  onSelect: (accountId?: string) => void;
  onRemove: (accountId: string) => void;
  formProps: IFormProps;
  renderForm?: () => JSX.Element;
};

const AccountsContainer = (props: Props) => {
  const { kind, renderForm, addLink, onSelect, formProps, onRemove } = props;

  const {
    loading: fetchApiQueryLoading,
    error: fetchApiQueryError,
    data: fetchApiQueryData
  } = useQuery<AccountsQueryResponse>(gql(queries.fetchApi),
    {
      variables: {
        path: '/accounts',
        params: { kind }
      }
    }
  );

  const [removeMutation, { error: removeAccountMutationError }] =
    useMutation<RemoveAccountMutationResponse, { _id: string }>(
      gql(mutations.removeAccount), {
      refetchQueries: ['integrationsFetchApi']
    });

  const onAdd = () => {
    const { REACT_APP_API_URL } = getEnv();
    const url = `${REACT_APP_API_URL}/connect-integration?link=${addLink}&kind=${kind}`;

    window.location.replace(url);
  };

  const removeAccount = (accountId: string) => {
    removeMutation({ variables: { _id: accountId } })
      .then(() => {
        Alert.success('You successfully removed an account');
        onRemove(accountId);
      })
      .catch(e => {
        Alert.error(e.message);
      });
  };

  if (fetchApiQueryLoading) {
    return <Spinner objective={true} />;
  }

  if (fetchApiQueryError || removeAccountMutationError) {
    return (
      <span style={{ color: 'red' }}>Integrations api is not running</span>
    );
  }

  const accounts = fetchApiQueryData ? fetchApiQueryData.integrationsFetchApi : [];

  return (
    <Accounts
      kind={kind}
      onAdd={onAdd}
      removeAccount={removeAccount}
      onSelect={onSelect}
      accounts={accounts}
      formProps={formProps}
      renderForm={renderForm}
    />
  );
}

export default AccountsContainer;
