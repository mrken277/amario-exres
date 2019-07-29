import gql from 'graphql-tag';
import LeadStatusFilter from 'modules/customers/components/list/LeadStatusFilter';
import { getConfig, setConfig } from 'modules/inbox/utils';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import { withProps } from '../../../common/utils';
import { queries } from '../../graphql';
import { CountQueryResponse } from '../../types';

type Props = {
  companyCountsQuery?: CountQueryResponse;
};

const STORAGE_KEY = `erxes_sidebar_section_config`;

class LeadStatusFilterContainer extends React.Component<Props> {
  render() {
    const { companyCountsQuery } = this.props;

    const counts = (companyCountsQuery
      ? companyCountsQuery.companyCounts
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
      loading:
        (companyCountsQuery ? companyCountsQuery.loading : null) || false,
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
    >(gql(queries.companyCounts), {
      name: 'companyCountsQuery',
      skip: ({ loadingMainQuery }) => loadingMainQuery,
      options: {
        variables: { only: 'byLeadStatus' }
      }
    })
  )(LeadStatusFilterContainer)
);
