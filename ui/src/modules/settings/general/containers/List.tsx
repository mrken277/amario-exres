import { useMutation, useQuery } from '@apollo/react-hooks';
import { AppConsumer } from 'appContext';
import gql from 'graphql-tag';
import Spinner from 'modules/common/components/Spinner';
import { Alert } from 'modules/common/utils';
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
    data: currencyConfigQueryData,
    refetch: currencyConfigQueryRefetch
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
    data: uomConfigQueryData,
    refetch: uomConfigQueryRefetch
  } = useQuery<ConfigDetailQueryResponse, { code: string }>(
    gql(queries.configsDetail),
    {
      fetchPolicy: 'network-only',
      variables: {
        code: 'dealUOM'
      }
    }
  );

  const [insertConfig, { error: insertConfigError }] =
    useMutation<ConfigsInsertMutationResponse, ConfigsInsertMutationVariables>(
      gql(mutations.insertConfig), { refetchQueries: ['configsDetail'] }
    );

  if (currencyConfigQueryError || uomConfigQueryError || insertConfigError) {
    return <p>Error!</p>;
  }

  if (currencyConfigQueryLoading || uomConfigQueryLoading) {
    return <Spinner objective={true} />;
  }

  const save = (code, value) => {
    insertConfig({
      variables: { code, value }
    })
      .then(() => {
        currencyConfigQueryRefetch();
        uomConfigQueryRefetch();

        Alert.success('You successfully updated general settings');
      })
      .catch(error => {
        Alert.error(error.message);
      });
  };

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