import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Alert } from 'modules/common/utils';
import BasicInfo from 'modules/settings/productService/components/product/detail/BasicInfo';
import { IProduct } from 'modules/settings/productService/types';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { IRouterProps } from '../../../../../common/types';
import { mutations } from '../../../graphql';
import { ProductRemoveMutationResponse } from '../../../types';

type Props = {
  product: IProduct;
};

type FinalProps = Props & IRouterProps;

const BasicInfoContainer = (props: FinalProps) => {
  const { product, history } = props;

  const { _id } = product;

  const [productsRemove, { error: productsRemoveMutationError }] =
    useMutation<ProductRemoveMutationResponse, { productIds: string[] }>(
      gql(mutations.productsRemove), {
      refetchQueries: ['products', 'productCategories', 'productsTotalCount']
    });

  if (productsRemoveMutationError) {
    return <p>Error!</p>;
  }

  const remove = () => {
    productsRemove({ variables: { productIds: [_id] } })
      .then(() => {
        Alert.success('You successfully deleted a product');
        history.push('/settings/product-service');
      })
      .catch(e => {
        Alert.error(e.message);
      });
  };

  const updatedProps = {
    ...props,
    remove
  };

  return <BasicInfo {...updatedProps} />;
};


export default withRouter<FinalProps>(BasicInfoContainer);
