import gql from 'graphql-tag';
import * as compose from 'lodash.flowright';
import CountsByTag from 'modules/common/components/CountsByTag';
import { TAG_TYPES } from 'modules/tags/constants';
import { queries as tagQueries } from 'modules/tags/graphql';
import React from 'react';
import { graphql } from 'react-apollo';
import { withProps } from 'modules/common/utils';
import { TagsQueryResponse } from 'modules/tags/types';
import { queries as carQueries } from '../../graphql';
import { CountQueryResponse } from '../../types';

const TagFilterContainer = (props: {
  carCountsQuery?: CountQueryResponse;
  tagsQuery?: TagsQueryResponse;
}) => {
  const { carCountsQuery, tagsQuery } = props;

  const counts = (carCountsQuery ? carCountsQuery.carCounts : null) || {
    byTag: {}
  };

  return (
    <CountsByTag
      tags={(tagsQuery ? tagsQuery.tags : null) || []}
      counts={counts.byTag || {}}
      manageUrl="/tags/car"
      loading={(tagsQuery ? tagsQuery.loading : null) || false}
    />
  );
};

export default withProps<{ loadingMainQuery: boolean }>(
  compose(
    graphql<
      { loadingMainQuery: boolean },
      CountQueryResponse,
      { only: string }
    >(gql(carQueries.carCounts), {
      name: 'carCountsQuery',
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
            type: TAG_TYPES.CAR
          }
        })
      }
    )
  )(TagFilterContainer)
);
