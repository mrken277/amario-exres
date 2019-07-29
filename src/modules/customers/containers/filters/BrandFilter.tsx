import gql from 'graphql-tag';
import { getConfig, setConfig } from 'modules/inbox/utils';
import { queries } from 'modules/settings/brands/graphql';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import { withProps } from '../../../common/utils';
import { BrandsQueryResponse } from '../../../settings/brands/types';
import BrandFilter from '../../components/list/BrandFilter';
import { queries as customerQueries } from '../../graphql';
import { CountQueryResponse } from '../../types';

type Props = {
  brandsQuery?: BrandsQueryResponse;
  customersCountQuery?: CountQueryResponse;
};

const STORAGE_KEY = `erxes_sidebar_section_config`;

const toggleSection = ({ name, isOpen }: { name: string; isOpen: boolean }) => {
  // const customerId = this.props.conversation.customerId;
  const config = getConfig(STORAGE_KEY);

  config[name] = isOpen;

  setConfig(STORAGE_KEY, config);

  // this.getCustomerDetail(customerId);
};

class BrandFilterContainer extends React.Component<Props> {
  render() {
    const { brandsQuery, customersCountQuery } = this.props;

    const counts = (customersCountQuery
      ? customersCountQuery.customerCounts
      : null) || { byBrand: {} };

    const updatedProps = {
      ...this.props,
      brands: (brandsQuery ? brandsQuery.brands : []) || [],
      loading: (brandsQuery && brandsQuery.loading) || false,
      counts: counts.byBrand,
      toggleSection,
      config: getConfig(STORAGE_KEY)
    };

    return <BrandFilter {...updatedProps} />;
  }
}

export default withProps<{ loadingMainQuery: boolean }>(
  compose(
    graphql<{ loadingMainQuery: boolean }, BrandsQueryResponse, {}>(
      gql(queries.brands),
      {
        name: 'brandsQuery',
        skip: ({ loadingMainQuery }) => loadingMainQuery
      }
    ),
    graphql<
      { loadingMainQuery: boolean },
      CountQueryResponse,
      { only: string }
    >(gql(customerQueries.customerCounts), {
      name: 'customersCountQuery',
      skip: ({ loadingMainQuery }) => loadingMainQuery,
      options: {
        variables: { only: 'byBrand' }
      }
    })
  )(BrandFilterContainer)
);
