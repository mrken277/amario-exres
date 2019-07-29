import gql from 'graphql-tag';
import { getConfig, setConfig } from 'modules/inbox/utils';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import { withProps } from '../../../common/utils';
import IntegrationFilter from '../../components/list/IntegrationFilter';
import { queries as customerQueries } from '../../graphql';
import { CountQueryResponse } from '../../types';
type Props = {
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

class IntegrationFilterContainer extends React.Component<Props> {
  render() {
    const { customersCountQuery } = this.props;

    const counts = (customersCountQuery
      ? customersCountQuery.customerCounts
      : null) || { byIntegrationType: {} };

    const updatedProps = {
      ...this.props,
      loading:
        (customersCountQuery ? customersCountQuery.loading : null) || false,
      counts: counts.byIntegrationType,
      toggleSection,
      config: getConfig(STORAGE_KEY)
    };

    return <IntegrationFilter {...updatedProps} />;
  }
}

export default withProps<{ loadingMainQuery: boolean }>(
  compose(
    graphql<
      { loadingMainQuery: boolean },
      CountQueryResponse,
      { only: string }
    >(gql(customerQueries.customerCounts), {
      name: 'customersCountQuery',
      skip: ({ loadingMainQuery }) => loadingMainQuery,
      options: {
        variables: { only: 'byIntegrationType' }
      }
    })
  )(IntegrationFilterContainer)
);
