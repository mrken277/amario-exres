import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import EmptyState from 'modules/common/components/EmptyState';
import Spinner from 'modules/common/components/Spinner';
import { DetailQueryResponse, IProduct } from 'modules/settings/productService/types';
import React from 'react';
import ProductDetails from '../../../components/product/detail/ProductDetails';
import { queries } from '../../../graphql';

type Props = {
  id: string;
};

const ProductDetailsContainer = (props: Props) => {
  const { id } = props;

  const {
    loading: productDetailQueryLoading,
    error: productDetailQueryError,
    data: productDetailQueryData
  } = useQuery<DetailQueryResponse, { _id: string }>(
    gql(queries.productDetail),
    { variables: { _id: id } }
  );

  if (productDetailQueryLoading) {
    return <Spinner objective={true} />;
  }

  if (productDetailQueryError) {
    return <p>Error!</p>;
  }

  if (!(productDetailQueryData && productDetailQueryData.productDetail)) {
    return (
      <EmptyState text="Product not found" image="/images/actions/24.svg" />
    );
  }

  const productDetail = productDetailQueryData ? productDetailQueryData.productDetail : {} as IProduct;

  return <ProductDetails product={productDetail} />;
};

export default ProductDetailsContainer;
