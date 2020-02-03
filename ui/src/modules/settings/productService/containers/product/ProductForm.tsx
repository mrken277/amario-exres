import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import ButtonMutate from 'modules/common/components/ButtonMutate';
import { IButtonMutateProps } from 'modules/common/types';
import React from 'react';
import Form from '../../components/product/ProductForm';
import { mutations, queries } from '../../graphql';
import { IProduct, ProductCategoriesQueryResponse } from '../../types';

type Props = {
  product?: IProduct;
  closeModal: () => void;
};

const ProductFormContainer = (props: Props) => {
  const {
    loading: productCategoriesQueryLoading,
    error: productCategoriesQueryError,
    data: productCategoriesQueryData
  } = useQuery<ProductCategoriesQueryResponse>(
    gql(queries.productCategories));

  if (productCategoriesQueryError) {
    return <p>Error!</p>;
  }

  if (productCategoriesQueryLoading) {
    return null;
  }

  const renderButton = ({
    name,
    values,
    isSubmitted,
    callback,
    object
  }: IButtonMutateProps) => {
    values.unitPrice = Number(values.unitPrice);

    return (
      <ButtonMutate
        mutation={object ? mutations.productEdit : mutations.productAdd}
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
    renderButton,
    productCategories
  };

  return <Form {...updatedProps} />;
}

const getRefetchQueries = () => {
  return ['productDetail', 'products', 'productsTotalCount'];
};

export default ProductFormContainer;