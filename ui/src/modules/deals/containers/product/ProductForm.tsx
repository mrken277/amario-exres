import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import ErrorMsg from 'modules/common/components/ErrorMsg';
import Spinner from 'modules/common/components/Spinner';
import checkError from 'modules/common/utils/checkError';
import { queries as generalQueries } from 'modules/settings/general/graphql';
import { IProduct } from 'modules/settings/productService/types';
import React from 'react';
import { ConfigDetailQueryResponse } from '../../../settings/general/types';
import ProductForm from '../../components/product/ProductForm';
import { IPaymentsData, IProductData } from '../../types';

type Props = {
  onChangeProductsData: (productsData: IProductData[]) => void;
  saveProductsData: () => void;
  savePaymentsData: () => void;
  onChangePaymentsData: (paymentsData: IPaymentsData) => void;
  productsData: IProductData[];
  products: IProduct[];
  paymentsData?: IPaymentsData;
  closeModal: () => void;
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

  return <ProductForm {...extendedProps} />;
}

export default ProductItemFormContainer;
