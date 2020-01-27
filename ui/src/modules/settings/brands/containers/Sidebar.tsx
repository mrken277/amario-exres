import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import ButtonMutate from 'modules/common/components/ButtonMutate';
import { IButtonMutateProps } from 'modules/common/types';
import { Alert, confirm } from 'modules/common/utils';
import React from 'react';
import { ChildProps } from 'react-apollo';
import Sidebar from '../components/Sidebar';
import { mutations, queries } from '../graphql';
import {
  BrandRemoveMutationResponse,
  BrandRemoveMutationVariables,
  BrandsCountQueryResponse,
  BrandsQueryResponse
} from '../types';

type Props = {
  queryParams: any;
  currentBrandId?: string;
  history?: any
};

const SidebarContainer = (props: ChildProps<Props>) => {
  const {
    queryParams,
    currentBrandId,
    history
  } = props;

  const {
    loading: brandsQueryLoading,
    error: brandsQueryError,
    data: brandsQueryData
  } = useQuery<BrandsQueryResponse, { perPage: number }>(
    gql(queries.brands),
    {
      variables: {
        perPage: queryParams.limit ? parseInt(queryParams.limit, 10) : 20
      },
      fetchPolicy: 'network-only'
    }
  );

  const {
    loading: brandsCountQueryLoading,
    error: brandsCountQueryError,
    data: brandsCountQueryData
  } = useQuery<BrandsCountQueryResponse>(gql(queries.brandsCount));

  const [removeMutation, { error: brandRemoveMutationError }] =
    useMutation<BrandRemoveMutationResponse, BrandRemoveMutationVariables>(
      gql(mutations.brandRemove), {
      refetchQueries: getRefetchQueries(queryParams, currentBrandId)
    });

  const brands = brandsQueryData ? brandsQueryData.brands : [];
  const brandsTotalCount = brandsCountQueryData ? brandsCountQueryData.brandsTotalCount : 0;

  // remove action
  const remove = brandId => {
    confirm().then(() => {
      removeMutation({
        variables: { _id: brandId }
      })
        .then(() => {
          Alert.success('You successfully deleted a brand.');
          history.push('/settings/brands');
        })
        .catch(error => {
          Alert.error(error.message);
        });
    });
  };

  const renderButton = ({
    name,
    values,
    isSubmitted,
    callback,
    object
  }: IButtonMutateProps) => {
    return (
      <ButtonMutate
        mutation={object ? mutations.brandEdit : mutations.brandAdd}
        variables={values}
        callback={callback}
        refetchQueries={getRefetchQueries(queryParams, currentBrandId)}
        isSubmitted={isSubmitted}
        type="submit"
        successMessage={`You successfully ${
          object ? 'updated' : 'added'
          } a ${name}`}
      />
    );
  };

  if (brandsQueryError || brandsCountQueryError || brandRemoveMutationError) {
    return <p>Error!</p>;
  }

  if (brandsCountQueryLoading || brandsQueryLoading) {
    return <p>Loading...</p>;
  }

  const updatedProps = {
    ...props,
    renderButton,
    brands,
    brandsTotalCount,
    remove,
    loading: brandsQueryLoading
  };

  return <Sidebar {...updatedProps} />;
};

const getRefetchQueries = (queryParams, currentBrandId?: string) => {
  return [
    {
      query: gql(queries.brands),
      variables: {
        perPage: queryParams.limit ? parseInt(queryParams.limit, 10) : 20
      }
    },
    {
      query: gql(queries.brands)
    },
    {
      query: gql(queries.integrationsCount)
    },
    {
      query: gql(queries.brandDetail),
      variables: { _id: currentBrandId || '' }
    },
    { query: gql(queries.brandsCount) }
  ];
};

export default SidebarContainer;
