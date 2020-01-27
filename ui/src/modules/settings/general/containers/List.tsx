import { useMutation, useQuery } from '@apollo/react-hooks';
import { AppConsumer } from 'appContext';
import gql from 'graphql-tag';
import React from 'react';
import List from '../components/List';
import { mutations, queries } from '../graphql';
import {
  ConfigDetailQueryResponse,
  ConfigsInsertMutationResponse,
  ConfigsInsertMutationVariables
} from '../types';

const ListContainer = () => {
  const {
    loading: currencyConfigQueryLoading,
    error: currencyConfigQueryError,
    data: currencyConfigQueryData
  } = useQuery<ConfigDetailQueryResponse, { code: string }>(
    gql(queries.configsDetail),
    {
      fetchPolicy: 'network-only',
      variables: {
        code: 'dealCurrency'
      }
    }
  );

  const {
    loading: uomConfigQueryLoading,
    error: uomConfigQueryError,
    data: uomConfigQueryData
  } = useQuery<ConfigDetailQueryResponse, { code: string }>(
    gql(queries.configsDetail),
    {
      fetchPolicy: 'network-only',
      variables: {
        code: 'dealUOM'
      }
    }
  );

  const [mutate, { error: insertConfigError }] =
    useMutation<ConfigsInsertMutationResponse, ConfigsInsertMutationVariables>(
      gql(mutations.insertConfig), { refetchQueries: ['configsDetail'] }
    );

  const save = (code, value) => {
    mutate({ variables: { code, value } })
  };

  if (currencyConfigQueryError || uomConfigQueryError || insertConfigError) {
    return <p>Error!</p>;
  }

  if (currencyConfigQueryLoading || uomConfigQueryLoading) {
    return <p>Loading...</p>;
  }

  const currencies = currencyConfigQueryData && currencyConfigQueryData.configsDetail;
  const uom = uomConfigQueryData && uomConfigQueryData.configsDetail;

  const updatedProps = {
    currencies: currencies ? currencies.value : [],
    uom: uom ? uom.value : [],
    save
  };

  return (
    <AppConsumer>
      {({ currentLanguage, changeLanguage }) => (
        <List
          {...updatedProps}
          currentLanguage={currentLanguage}
          changeLanguage={changeLanguage}
        />
      )}
    </AppConsumer>
  );
}

export default ListContainer;