import gql from 'graphql-tag';
import * as compose from 'lodash.flowright';
import { withProps } from 'modules/common/utils';
import Segments from 'modules/segments/containers/Filter';
import React from 'react';
import { graphql } from 'react-apollo';
import { queries } from '../../graphql';
import { CountQueryResponse } from '../../types';

const SegmentFilterContainer = (props: {
  carCountsQuery?: CountQueryResponse;
}) => {
  const { carCountsQuery } = props;

  const counts = (carCountsQuery ? carCountsQuery.carCounts : null) || {
    bySegment: {}
  };

  return <Segments contentType="car" counts={counts.bySegment || {}} />;
};

export default withProps<{ loadingMainQuery: boolean }>(
  compose(
    graphql<
      { loadingMainQuery: boolean },
      CountQueryResponse,
      { only: string }
    >(gql(queries.carCounts), {
      name: 'carCountsQuery',
      skip: ({ loadingMainQuery }) => loadingMainQuery,
      options: {
        variables: { only: 'bySegment' }
      }
    })
  )(SegmentFilterContainer)
);
