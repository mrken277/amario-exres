import gql from 'graphql-tag';
import BrandFilter from 'modules/customers/components/list/BrandFilter';
import { getConfig, setConfig } from 'modules/inbox/utils';
import { queries } from 'modules/settings/brands/graphql';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import { withProps } from '../../../common/utils';
import { BrandsQueryResponse } from '../../../settings/brands/types';
import { queries as companyQueries } from '../../graphql';
import { CountQueryResponse } from '../../types';

type FinalProps = {
  brandsQuery?: BrandsQueryResponse;
  companyCountsQuery?: CountQueryResponse;
} & Props;

const STORAGE_KEY = `erxes_sidebar_section_config`;

const toggleSection = ({ name, isOpen }: { name: string; isOpen: boolean }) => {
  // const customerId = this.props.conversation.customerId;
  const config = getConfig(STORAGE_KEY);

  config[name] = isOpen;

  setConfig(STORAGE_KEY, config);

  // this.getCustomerDetail(customerId);
};

class BrandFilterContainer extends React.Component<FinalProps> {
  render() {
    const { companyCountsQuery, brandsQuery } = this.props;

    const counts = (companyCountsQuery
      ? companyCountsQuery.companyCounts
      : null) || { byBrand: {} };

    const updatedProps = {
      ...this.props,
      brands: (brandsQuery ? brandsQuery.brands : null) || [],
      loading: (brandsQuery ? brandsQuery.loading : null) || false,
      counts: counts.byBrand || {},
      toggleSection,
      config: getConfig(STORAGE_KEY)
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
      gql(companyQueries.companyCounts),
      {
        name: 'companyCountsQuery',
        skip: ({ loadingMainQuery }) => loadingMainQuery,
        options: {
          variables: { only: 'byBrand' }
        }
      }
    )
  )(BrandFilterContainer)
);
