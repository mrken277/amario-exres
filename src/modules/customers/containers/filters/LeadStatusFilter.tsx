import gql from 'graphql-tag';
import { getConfig, setConfig } from 'modules/inbox/utils';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import { withProps } from '../../../common/utils';
import LeadStatusFilter from '../../components/list/LeadStatusFilter';
import { queries } from '../../graphql';
import { CountQueryResponse } from '../../types';
type Props = {
  customersCountQuery?: CountQueryResponse;
};

const STORAGE_KEY = `erxes_sidebar_section_config`;

class LeadStatusFilterContainer extends React.Component<Props> {
  render() {
    const { customersCountQuery } = this.props;

    const counts = (customersCountQuery
      ? customersCountQuery.customerCounts
      : null) || { byLeadStatus: {} };

    const toggleSection = ({
      name,
      isOpen
    }: {
      name: string;
      isOpen: boolean;
    }) => {
      // const customerId = this.props.conversation.customerId;
      const config = getConfig(STORAGE_KEY);

      config[name] = isOpen;

      setConfig(STORAGE_KEY, config);

      // this.getCustomerDetail(customerId);
    };

    const updatedProps = {
      counts: counts.byLeadStatus || {},
      loading: customersCountQuery ? customersCountQuery.loading : false,
      toggleSection,
      config: getConfig(STORAGE_KEY)
    };

    return <LeadStatusFilter {...updatedProps} />;
  }
}

export default withProps<{ loadingMainQuery: boolean }>(
  compose(
    graphql<
      { loadingMainQuery: boolean },
      CountQueryResponse,
      { only: string }
    >(gql(queries.customerCounts), {
      name: 'customersCountQuery',
      skip: ({ loadingMainQuery }) => loadingMainQuery,
      options: {
        variables: { only: 'byLeadStatus' }
      }
    })
  )(LeadStatusFilterContainer)
);
