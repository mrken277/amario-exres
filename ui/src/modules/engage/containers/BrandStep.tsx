import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import ButtonMutate from 'modules/common/components/ButtonMutate';
import ErrorMsg from 'modules/common/components/ErrorMsg';
import Spinner from 'modules/common/components/Spinner';
import { IButtonMutateProps } from 'modules/common/types';
import checkError from 'modules/common/utils/checkError';
import { CountQueryResponse } from 'modules/customers/types';
import { mutations } from 'modules/settings/brands/graphql';
import { BrandsQueryResponse } from 'modules/settings/brands/types';
import React from 'react';
import BrandStep from '../components/step/BrandStep';
import { queries } from '../graphql';
import { sumCounts } from '../utils';

type Props = {
  messageType: string;
  brandIds: string[];
  onChange: (name: string, value: string[]) => void;
  renderContent: (
    {
      actionSelector,
      selectedComponent,
      customerCounts
    }: {
      actionSelector: React.ReactNode;
      selectedComponent: React.ReactNode;
      customerCounts: React.ReactNode;
    }
  ) => React.ReactNode;
};

function ConversationContainer(props: Props) {

  const {
    loading: brandsLoading,
    error: brandsError,
    data: brandsData
  } = useQuery<BrandsQueryResponse>(
    gql(queries.brands));

  const {
    loading: customerCountsLoading,
    error: customerCountsError,
    data: customerCountsData
  } = useQuery<CountQueryResponse, { only: string }>(
    gql(queries.customerCounts), {
    variables: {
      only: 'byBrand'
    }
  });

  const customerCounts = (customerCountsData && customerCountsData.customerCounts) || {
    byBrand: {}
  };

  if (brandsError || customerCountsError) {
    const error = checkError([brandsError, customerCountsError]);

    return <ErrorMsg>{error.message}</ErrorMsg>;
  };

  if (brandsLoading || customerCountsLoading) {
    return <Spinner objective={true} />;
  };

  const countValues = customerCounts.byBrand || {};
  const customersCount = (ids: string[]) => sumCounts(ids, countValues);

  const renderButton = ({
    name,
    values,
    isSubmitted,
    callback,
    object
  }: IButtonMutateProps) => {
    return (
      <ButtonMutate
        mutation={mutations.brandAdd}
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

  const updatedProps = {
    ...props,
    brands: (brandsData && brandsData.brands) || [],
    targetCount: countValues,
    customersCount,
    renderButton
  };

  return <BrandStep {...updatedProps} />;
}

const getRefetchQueries = () => {
  return [
    {
      query: gql(queries.customerCounts),
      variables: { only: 'byBrand' }
    },
    { query: gql(queries.brands) }
  ];
};

export default ConversationContainer;