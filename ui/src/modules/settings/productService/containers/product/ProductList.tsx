import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Bulk from 'modules/common/components/Bulk';
import { Alert } from 'modules/common/utils';
import { generatePaginationParams } from 'modules/common/utils/router';
import React from 'react';
import List from '../../components/product/ProductList';
import { mutations, queries } from '../../graphql';
import {
  CategoryDetailQueryResponse,
  ProductRemoveMutationResponse,
  ProductsCountQueryResponse,
  ProductsQueryResponse
} from '../../types';

type Props = {
  queryParams: any;
  history: any;
};

const ProductListContainer = (props: Props) => {
  const { queryParams } = props;

  const {
    loading: productsQueryLoading,
    error: productsQueryError,
    data: productsQueryData,
    refetch: productQueryRefetch
  } = useQuery<ProductsQueryResponse>(
    gql(queries.products),
    {
      variables: {
        categoryId: queryParams.categoryId,
        tag: queryParams.tag,
        ...generatePaginationParams(queryParams)
      }
    }
  );

  const {
    loading: productsCountQueryLoading,
    error: productsCountQueryError,
    data: productsCountQueryData
  } = useQuery<ProductsCountQueryResponse>(gql(queries.productsCount));

  const {
    loading: productCategoryDetailQueryLoading,
    error: productCategoryDetailQueryError,
    data: productCategoryDetailQueryData
  } = useQuery<CategoryDetailQueryResponse>(gql(queries.productCategoryDetail), {
    variables: {
      _id: queryParams.categoryId
    }
  });

  const [productsRemove, { error: productsRemoveMutationError }] =
    useMutation<ProductRemoveMutationResponse, { productIds: string[] }>(
      gql(mutations.productsRemove), {
      refetchQueries: getRefetchQueries()
    });

  if (productsQueryLoading || productsCountQueryLoading || productCategoryDetailQueryLoading) {
    return <p>Loading...</p>;
  }

  if (productsRemoveMutationError || productCategoryDetailQueryError || productsCountQueryError || productsQueryError) {
    return <p>Error!</p>;
  }

  const products = productsQueryData ? productsQueryData.products : [];

  // remove action
  const remove = ({ productIds }, emptyBulk) => {
    productsRemove({
      variables: { productIds }
    })
      .then(() => {
        emptyBulk();
        Alert.success('You successfully deleted a product');
      })
      .catch(e => {
        Alert.error(e.message);
      });
  };

  const updatedProps = {
    ...props,
    queryParams,
    products,
    remove,
    loading: productsQueryLoading,
    productsCount: productsCountQueryData ? productsCountQueryData.productsTotalCount : 0,
    currentCategory: productCategoryDetailQueryData ? productCategoryDetailQueryData.productCategoryDetail : {}
  };

  const productList = listProps => {
    return <List {...updatedProps} {...listProps} />;
  };

  return <Bulk content={productList} refetch={productQueryRefetch} />;
}

const getRefetchQueries = () => {
  return [
    'products',
    'productCategorires',
    'productCategoriesCount',
    'productsTotalCount',
    'productCountByTags'
  ];
};

export default ProductListContainer;