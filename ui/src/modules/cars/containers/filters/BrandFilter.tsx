import gql from 'graphql-tag';
import * as compose from 'lodash.flowright';
import BrandFilter from 'modules/customers/components/list/BrandFilter';
import { queries } from 'modules/settings/brands/graphql';
import React from 'react';
import { graphql } from 'react-apollo';
import { withProps } from '../../../common/utils';
import { BrandsQueryResponse } from '../../../settings/brands/types';
import { queries as carQueries } from '../../graphql';
import { CountQueryResponse } from '../../types';

type FinalProps = {
  brandsQuery?: BrandsQueryResponse;
  carCountsQuery?: CountQueryResponse;
} & Props;

class BrandFilterContainer extends React.Component<FinalProps> {
  render() {
    const { carCountsQuery, brandsQuery } = this.props;

    const counts = (carCountsQuery ? carCountsQuery.carCounts : null) || {
      byBrand: {}
    };

    const updatedProps = {
      ...this.props,
      brands: (brandsQuery ? brandsQuery.brands : null) || [],
      loading: (brandsQuery ? brandsQuery.loading : null) || false,
      counts: counts.byBrand || {}
    };

    return <BrandFilter {...updatedProps} />;
  }
}

type Props = {
  loadingMainQuery: boolean;
};

export default withProps<Props>(
  compose(
    graphql<Props, BrandsQueryResponse>(gql(queries.brands), {
      name: 'brandsQuery',
      skip: ({ loadingMainQuery }) => loadingMainQuery
    }),
    graphql<Props, CountQueryResponse, { only: string }>(
      gql(carQueries.carCounts),
      {
        name: 'carCountsQuery',
        skip: ({ loadingMainQuery }) => loadingMainQuery,
        options: {
          variables: { only: 'byBrand' }
        }
      }
    )
  )(BrandFilterContainer)
);
