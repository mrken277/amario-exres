import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import ErrorMsg from 'modules/common/components/ErrorMsg';
import Spinner from 'modules/common/components/Spinner';
import checkError from 'modules/common/utils/checkError';
import { queries as generalQueries } from 'modules/settings/general/graphql';
import React from 'react';
import { ConfigDetailQueryResponse } from '../../../settings/general/types';
import ProductItemForm from '../../components/product/ProductItemForm';
import { IProductData } from '../../types';

type Props = {
  productData: IProductData;
  removeProductItem?: (productId: string) => void;
  productsData?: IProductData[];
  onChangeProductsData: (productsData: IProductData[]) => void;
  updateTotal: () => void;
};

type TVariables = {
  code: string;
};

const getValue = (data?: ConfigDetailQueryResponse) => {
  return data && data.configsDetail ? data.configsDetail.value : [];
};

function ProductItemFormContainer(props: Props) {
  const {
    error: getUomError,
    loading: getUomLoading,
    data: getUomData
  } = useQuery<ConfigDetailQueryResponse, TVariables>(
    gql(generalQueries.configsDetail),
    {
      variables: {
        code: 'dealUOM'
      }
    }
  );

  const {
    error: getCurrenciesError,
    loading: getCurrenciesLoading,
    data: getCurrenciesData
  } = useQuery<ConfigDetailQueryResponse, TVariables>(
    gql(generalQueries.configsDetail),
    {
      variables: {
        code: 'dealCurrency'
      }
    }
  );

  if (getUomError || getCurrenciesError) {
    const error = checkError([getUomError, getCurrenciesError]);

    return <ErrorMsg>{error.message}</ErrorMsg>;
  }

  if (getUomLoading || getCurrenciesLoading) {
    return <Spinner objective={true} />;
  }

  const uom = getValue(getUomData);
  const currencies = getValue(getCurrenciesData);

  const extendedProps = {
    ...props,
    uom,
    currencies
  };

  return <ProductItemForm {...extendedProps} />;
}

export default ProductItemFormContainer;
