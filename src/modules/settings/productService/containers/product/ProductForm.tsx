import gql from 'graphql-tag';
import ButtonMutate from 'modules/common/components/ButtonMutate';
import { IButtonMutateProps } from 'modules/common/types';
import { withProps } from 'modules/common/utils';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import Form from '../../components/product/ProductForm';
import { mutations, queries } from '../../graphql';
import { IProduct, ProductCategoriesQueryResponse } from '../../types';

type Props = {
  product?: IProduct;
  currentCategoryId?: string;
  closeModal: () => void;
};

type FinalProps = {
  productCategoriesQuery: ProductCategoriesQueryResponse;
} & Props;

class ProductFormContainer extends React.Component<FinalProps> {
  render() {
    const { productCategoriesQuery, currentCategoryId } = this.props;

    if (productCategoriesQuery.loading) {
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

    const productCategories = productCategoriesQuery.productCategories || [];

    const updatedProps = {
      ...this.props,
      renderButton,
      productCategories,
      currentCategoryId
    };

    return <Form {...updatedProps} />;
  }
}

const getRefetchQueries = () => {
  return ['productDetail', 'products', 'productsTotalCount'];
};

export default withProps<Props>(
  compose(
    graphql<Props, ProductCategoriesQueryResponse>(
      gql(queries.productCategories),
      {
        name: 'productCategoriesQuery'
      }
    )
  )(ProductFormContainer)
);
