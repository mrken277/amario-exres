import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Alert } from 'modules/common/utils';
import { IIntegration } from 'modules/settings/integrations/types';
import React from 'react';
import ChooseBrand from '../components/ChooseBrand';
import { mutations, queries } from '../graphql';
import { BrandsQueryResponse, IChooseBrand } from '../types';

type Variables = {
  name: string;
  brandId: string;
};

type Props = {
  integration: IIntegration;
  onSave: () => void;
  refetch: () => void;
};

const ChooseBrandContainer = (props: Props) => {
  const {
    integration,
    onSave,
    refetch
  } = props;

  const {
    loading: brandsQueryLoading,
    error: brandsQueryError,
    data: brandsQueryData
  } = useQuery<BrandsQueryResponse>(gql(queries.brands),
    { fetchPolicy: 'network-only' }
  );

  const [addMutation, { error: integrationsCreateMessengerError }] =
    useMutation<{}, Variables>(
      gql(mutations.integrationsCreateMessenger));

  const [editMutation, { error: integrationsEditMessengerError }] =
    useMutation<{}, Variables>(
      gql(mutations.integrationsEditMessenger));

  const save = (variables: IChooseBrand) => {
    let mutation = addMutation;

    if (integration && integration._id) {
      mutation = editMutation;
      variables._id = integration._id;
    }

    mutation({
      variables
    })
      .then(() => {
        if (refetch) {
          refetch();
        }

        if (onSave) {
          onSave();
        }

        Alert.success('You successfully chose a new brand');
      })
      .catch(error => {
        Alert.error(error.message);
      });
  };

  if (brandsQueryError || integrationsCreateMessengerError || integrationsEditMessengerError) {
    return <p>Error!</p>;
  }

  if (brandsQueryLoading) {
    return <p>Loading...</p>;
  }

  const updatedProps = {
    ...props,
    save,
    brands: brandsQueryData ? brandsQueryData.brands : []
  };

  return <ChooseBrand {...updatedProps} />;
};

export default ChooseBrandContainer;
