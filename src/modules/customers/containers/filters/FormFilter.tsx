import gql from 'graphql-tag';
import { getConfig, setConfig } from 'modules/inbox/utils';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import { withProps } from '../../../common/utils';
import { IntegrationsQueryResponse } from '../../../settings/integrations/types';
import FormFilter from '../../components/list/FormFilter';
import { queries } from '../../graphql';
import { CountQueryResponse } from '../../types';

type Props = {
  integrationsQuery?: IntegrationsQueryResponse;
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

const FormFilterContainer = (props: Props) => {
  const { integrationsQuery, customersCountQuery } = props;

  const counts = (customersCountQuery
    ? customersCountQuery.customerCounts
    : null) || { byForm: {} };
  const integrations =
    (integrationsQuery ? integrationsQuery.integrations : null) || [];

  const updatedProps = {
    ...props,
    counts: counts.byForm || {},
    integrations,
    loading: integrationsQuery ? integrationsQuery.loading : false,
    toggleSection,
    config: getConfig(STORAGE_KEY)
  };

  return <FormFilter {...updatedProps} />;
};

export default withProps<{ loadingMainQuery: boolean }>(
  compose(
    graphql<{ loadingMainQuery: boolean }, IntegrationsQueryResponse, {}>(
      gql`
        query integrations {
          integrations(kind: "form") {
            _id
            name
            form {
              _id
            }
          }
        }
      `,
      {
        name: 'integrationsQuery',
        skip: ({ loadingMainQuery }) => loadingMainQuery
      }
    ),
    graphql<
      { loadingMainQuery: boolean },
      CountQueryResponse,
      { only: string }
    >(gql(queries.customerCounts), {
      name: 'customersCountQuery',
      skip: ({ loadingMainQuery }) => loadingMainQuery,
      options: {
        variables: { only: 'byForm' }
      }
    })
  )(FormFilterContainer)
);
