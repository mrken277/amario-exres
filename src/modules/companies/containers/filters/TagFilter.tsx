import gql from 'graphql-tag';
import CountsByTag from 'modules/common/components/CountsByTag';
import { getConfig, setConfig } from 'modules/inbox/utils';
import { TAG_TYPES } from 'modules/tags/constants';
import { queries as tagQueries } from 'modules/tags/graphql';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import { withProps } from '../../../common/utils';
import { TagsQueryResponse } from '../../../tags/types';
import { queries as companyQueries } from '../../graphql';
import { CountQueryResponse } from '../../types';

const STORAGE_KEY = `erxes_sidebar_section_config`;

const toggleSection = ({ name, isOpen }: { name: string; isOpen: boolean }) => {
  // const customerId = this.props.conversation.customerId;
  const config = getConfig(STORAGE_KEY);

  config[name] = isOpen;

  setConfig(STORAGE_KEY, config);

  // this.getCustomerDetail(customerId);
};
const TagFilterContainer = (props: {
  companyCountsQuery?: CountQueryResponse;
  tagsQuery?: TagsQueryResponse;
}) => {
  const { companyCountsQuery, tagsQuery } = props;

  const counts = (companyCountsQuery
    ? companyCountsQuery.companyCounts
    : null) || { byTag: {} };

  return (
    <CountsByTag
      tags={(tagsQuery ? tagsQuery.tags : null) || []}
      counts={counts.byTag || {}}
      manageUrl="tags/company"
      loading={(tagsQuery ? tagsQuery.loading : null) || false}
      toggleSection={toggleSection}
      config={getConfig(STORAGE_KEY)}
    />
  );
};

export default withProps<{ loadingMainQuery: boolean }>(
  compose(
    graphql<
      { loadingMainQuery: boolean },
      CountQueryResponse,
      { only: string }
    >(gql(companyQueries.companyCounts), {
      name: 'companyCountsQuery',
      skip: ({ loadingMainQuery }) => loadingMainQuery,
      options: {
        variables: { only: 'byTag' }
      }
    }),
    graphql<{ loadingMainQuery: boolean }, TagsQueryResponse, { type: string }>(
      gql(tagQueries.tags),
      {
        name: 'tagsQuery',
        skip: ({ loadingMainQuery }) => loadingMainQuery,
        options: () => ({
          variables: {
            type: TAG_TYPES.COMPANY
          }
        })
      }
    )
  )(TagFilterContainer)
);
