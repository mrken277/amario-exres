import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Chooser from 'modules/common/components/Chooser';
import ErrorMsg from 'modules/common/components/ErrorMsg';
import Spinner from 'modules/common/components/Spinner';
import { Alert } from 'modules/common/utils';
import checkError from 'modules/common/utils/checkError';
import ProductCategoryChooser from 'modules/deals/components/product/ProductCategoryChooser';
import ProductForm from 'modules/settings/productService/containers/product/ProductForm';
import {
  mutations as productMutations,
  queries as productQueries
} from 'modules/settings/productService/graphql';
import { ProductCategoriesQueryResponse } from 'modules/settings/productService/types';
import React, { useState } from 'react';
import { IProduct, IProductDoc } from '../../../settings/productService/types';
import { ProductAddMutationResponse, ProductsQueryResponse } from '../../types';

type Props = {
  data: { name: string; products: IProduct[] };
  categoryId: string;
  onChangeCategory: (catgeoryId: string) => void;
  closeModal: () => void;
  onSelect: (products: IProduct[]) => void;
};

export default (props: Props, state: any) => {
  const defaultPerPage = 20;
  const { data, onSelect, categoryId, onChangeCategory } = props;
  const [perPage, setPerPage] = useState(defaultPerPage);

  const {
    data: productsData,
    refetch: productsRefetch,
    error: productsError,
    loading: productsLoading
  } = useQuery<ProductsQueryResponse>(gql(productQueries.products), {
    variables: {
      perPage: defaultPerPage,
      categoryId
    }
  });

  const {
    data: productsCategoriesData,
    error: productsCategoriesError,
    loading: productsCategoriesLoading
  } = useQuery<ProductCategoriesQueryResponse>(
    gql(productQueries.productCategories)
  );

  const [
    productAdd,
    { error: mutationError, data: mutationData }
  ] = useMutation<ProductAddMutationResponse>(
    gql(productMutations.productAdd),
    {
      refetchQueries: [
        {
          query: gql(productQueries.products),
          variables: { perPage: defaultPerPage }
        }
      ]
    }
  );

  if (productsError || productsCategoriesError) {
    const error = checkError([productsError, productsCategoriesError]);

    return <ErrorMsg>{error.message}</ErrorMsg>;
  }

  if (productsLoading || productsCategoriesLoading) {
    return <Spinner objective={true} />;
  }

  const search = (value: string, reload?: boolean) => {
    if (!reload) {
      setPerPage(0);
    }

    // setPerPage(page => page + defaultPerPage);

    // productsRefetch({ perPage, searchValue: value });
  };

  // add product
  const addProduct = (doc: IProductDoc, callback: () => void) => {
    productAdd({
      variables: doc
    });

    if (mutationError) {
      Alert.error(mutationError.message);
    }

    if (mutationData) {
      productsRefetch();

      Alert.success('You successfully added a product or service');

      callback();
    }
  };

  const renderProductCategoryChooser = () => {
    return (
      <ProductCategoryChooser
        categories={
          (productsCategoriesData &&
            productsCategoriesData.productCategories) ||
          []
        }
        onChangeCategory={onChangeCategory}
      />
    );
  };

  const updatedProps = {
    ...props,
    data: { name: data.name, datas: data.products },
    search,
    title: 'Product',
    renderName: (product: IProduct) => product.name,
    renderForm: ({ closeModal }: { closeModal: () => void }) => (
      <ProductForm closeModal={closeModal} />
    ),
    perPage,
    add: addProduct,
    clearState: () => search('', true),
    datas: (productsData && productsData.products) || [],
    onSelect
  };

  return (
    <Chooser {...updatedProps} renderFilter={renderProductCategoryChooser} />
  );
};
