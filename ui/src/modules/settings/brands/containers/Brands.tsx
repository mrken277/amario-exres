import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Spinner from 'modules/common/components/Spinner';
import { router as routerUtils } from 'modules/common/utils';
import { IntegrationsCountQueryResponse } from 'modules/settings/integrations/types';
import queryString from 'query-string';
import React, { useEffect } from 'react';
import { withRouter } from 'react-router';
import { IRouterProps } from '../../../common/types';
import DumbBrands from '../components/Brands';
import Empty from '../components/Empty';
import { queries } from '../graphql';
import { BrandDetailQueryResponse, BrandsGetLastQueryResponse, IBrand } from '../types';

type Props = {
  currentBrandId: string;
  history: any;
  location: any;
  queryParams: any;
};

const BrandsContainer = (props: Props) => {
  const { currentBrandId, location } = props;

  const {
    loading: brandDetailQueryLoading,
    error: brandDetailQueryError,
    data: brandDetailQueryData
  } = useQuery<BrandDetailQueryResponse, { _id: string }>(
    gql(queries.brandDetail), {
    variables: { _id: currentBrandId },
    fetchPolicy: 'network-only'
  }
  );

  const {
    loading: integrationsCountQueryLoading,
    error: integrationsCountQueryError,
    data: integrationsCountQueryData
  } = useQuery<IntegrationsCountQueryResponse, { brandId: string }>(
    gql(queries.integrationsCount),
    { variables: { brandId: currentBrandId } }
  );

  let integrationsCount = 0;

  if (brandDetailQueryError || integrationsCountQueryError) {
    return <p>Error!</p>;
  }

  if (integrationsCountQueryLoading || brandDetailQueryLoading) {
    return <Spinner />;
  }

  if (!integrationsCountQueryLoading) {
    const byBrand = integrationsCountQueryData ? integrationsCountQueryData.integrationsTotalCount.byBrand : {};
    integrationsCount = byBrand[currentBrandId];
  }

  const extendedProps = {
    ...props,
    queryParams: queryString.parse(location.search),
    currentBrand: brandDetailQueryData ? brandDetailQueryData.brandDetail : {} as IBrand,
    loading: brandDetailQueryLoading,
    integrationsCount
  };

  return <DumbBrands {...extendedProps} />;
}

type WithCurrentIdProps = {
  history: any;
  location: any;
  queryParams: any;
};

const WithCurrentId = (props: WithCurrentIdProps) => {
  const { _id } = props.queryParams;

  const {
    loading: brandsGetLastQueryLoading,
    error: brandsGetLastQueryError,
    data: brandsGetLastQueryData
  } = useQuery<BrandsGetLastQueryResponse, { _id: string }>(
    gql(queries.brandsGetLast), {
    variables: { _id },
    fetchPolicy: 'network-only',
    skip: _id
  }
  );

  useEffect(() => {
    const { history } = props;

    if (
      !history.location.hash &&
      brandsGetLastQueryData &&
      !_id &&
      brandsGetLastQueryData.brandsGetLast &&
      !brandsGetLastQueryLoading
    ) {
      routerUtils.setParams(
        history,
        { _id: brandsGetLastQueryData.brandsGetLast._id },
        true
      );
    }
  });

  if (brandsGetLastQueryError) {
    return <p>Error!</p>;
  }

  if (brandsGetLastQueryLoading) {
    return <Spinner objective={true} />;
  }

  if (!_id) {
    return <Empty {...props} />;
  }

  const updatedProps = {
    ...props,
    currentBrandId: _id
  };

  return <BrandsContainer {...updatedProps} />;
}

const WithQueryParams = (props: IRouterProps) => {
  const { location } = props;
  const queryParams = queryString.parse(location.search);

  const extendedProps = { ...props, queryParams };

  return <WithCurrentId {...extendedProps} />;
};

export default withRouter<IRouterProps>(WithQueryParams);
