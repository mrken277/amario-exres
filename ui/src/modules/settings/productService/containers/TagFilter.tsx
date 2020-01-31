import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import CountsByTag from 'modules/common/components/CountsByTag';
import { TAG_TYPES } from 'modules/tags/constants';
import { queries as tagQueries } from 'modules/tags/graphql';
import React from 'react';
import { TagsQueryResponse } from '../../../tags/types';
import { queries } from '../graphql';
import { CountByTagsQueryResponse } from '../types';

const TagFilterContainer = () => {
  const {
    loading: countByTagsQueryLoading,
    error: countByTagsQueryError,
    data: countByTagsQueryData
  } = useQuery<CountByTagsQueryResponse, {}>(
    gql(queries.productCountByTags));

  const {
    loading: tagsQueryLoading,
    error: tagsQueryError,
    data: tagsQueryData
  } = useQuery<TagsQueryResponse, { type: string }>(
    gql(tagQueries.tags), {
    variables: {
      type: TAG_TYPES.PRODUCT
    }
  });

  if (countByTagsQueryError || tagsQueryError) {
    return <p>Error!</p>;
  }

  if (tagsQueryLoading) {
    return <p>Loading...</p>;
  }

  const counts = countByTagsQueryData ? countByTagsQueryData.productCountByTags : {};

  return (
    <CountsByTag
      tags={(tagsQueryData ? tagsQueryData.tags : null) || []}
      counts={counts}
      manageUrl="/tags/product"
      loading={(countByTagsQueryData ? countByTagsQueryLoading : null) || false}
    />
  );
};

export default TagFilterContainer;
