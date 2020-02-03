import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { queries as brandQueries } from 'modules/settings/brands/graphql';
import React from 'react';
import { BrandsQueryResponse } from '../../brands/types';
import List from '../components/List';

const ListContainer = () => {
  const {
    loading: brandsQueryLoading,
    error: brandsQueryError,
    data: brandsQueryData
  } = useQuery<BrandsQueryResponse, {}>(gql(brandQueries.brands));

  if (brandsQueryError) {
    return <p>Error!</p>;
  }

  if (brandsQueryLoading) {
    return <p>Loading...</p>;
  }

  const brands = brandsQueryData ? brandsQueryData.brands : [];

  return <List brands={brands} />;
};

export default ListContainer;
