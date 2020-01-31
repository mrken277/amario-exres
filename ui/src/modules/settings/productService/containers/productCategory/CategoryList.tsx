import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import ButtonMutate from 'modules/common/components/ButtonMutate';
import { IButtonMutateProps } from 'modules/common/types';
import { Alert, confirm } from 'modules/common/utils';
import React from 'react';
import List from '../../components/productCategory/CategoryList';
import { mutations, queries } from '../../graphql';
import {
  ProductCategoriesCountQueryResponse,
  ProductCategoriesQueryResponse,
  ProductCategoryRemoveMutationResponse
} from '../../types';

type Props = { history: any; queryParams: any };

const ProductListContainer = (props: Props) => {
  const {
    loading: productCategoriesQueryLoading,
    error: productCategoriesQueryError,
    data: productCategoriesQueryData,
    refetch: productCategoriesQueryRefetch
  } = useQuery<ProductCategoriesQueryResponse, { parentId: string }>(
    gql(queries.productCategories));

  const {
    loading: countQueryLoading,
    error: countQueryError,
    data: countQueryData,
    refetch: countQueryRefetch
  } = useQuery<ProductCategoriesCountQueryResponse>(
    gql(queries.productCategoriesCount));

  const [productCategoryRemove, { error: removeMutationError }] =
    useMutation<ProductCategoryRemoveMutationResponse, { _id: string }>(
      gql(mutations.productCategoryRemove), {
      refetchQueries: getRefetchQueries()
    });

  if (productCategoriesQueryError || countQueryError || removeMutationError) {
    return <p>Error!</p>;
  }

  if (productCategoriesQueryLoading || countQueryLoading) {
    return null;
  }

  const remove = productId => {
    confirm().then(() => {
      productCategoryRemove({
        variables: { _id: productId }
      })
        .then(() => {
          productCategoriesQueryRefetch();
          countQueryRefetch();

          Alert.success(
            `You successfully deleted a product & service category`
          );
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
        mutation={
          object
            ? mutations.productCategoryEdit
            : mutations.productCategoryAdd
        }
        variables={values}
        callback={callback}
        refetchQueries={getRefetchQueries()}
        isSubmitted={isSubmitted}
        type="submit"
        successMessage={`You successfully ${
          object ? 'updated' : 'added'
          } a ${name}`}
      />
    );
  };

  const productCategories = productCategoriesQueryData ? productCategoriesQueryData.productCategories : [];

  const updatedProps = {
    ...props,
    remove,
    renderButton,
    refetch: productCategoriesQueryRefetch,
    productCategories,
    loading: productCategoriesQueryLoading,
    productCategoriesCount:
      countQueryData ? countQueryData.productCategoriesTotalCount : 0
  };

  return <List {...updatedProps} />;
}

const getRefetchQueries = () => {
  return ['productCategories', 'productCategoriesTotalCount'];
};

export default ProductListContainer;
