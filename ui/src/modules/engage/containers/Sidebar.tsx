import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import ErrorMsg from 'modules/common/components/ErrorMsg';
import Spinner from 'modules/common/components/Spinner';
import { IRouterProps } from 'modules/common/types';
import checkError from 'modules/common/utils/checkError';
import { queries as tagQueries } from 'modules/tags/graphql';
import { ITag } from 'modules/tags/types';
import React from 'react';
import { withRouter } from 'react-router';
import Sidebar from '../components/Sidebar';
import { queries } from '../graphql';
import { CountQueryResponse, TagCountQueryResponse } from '../types';

type Props = {
  queryParams: any;
} & IRouterProps;

const SidebarContainer = (props: Props) => {

  const { queryParams } = props;

  const {
    loading: kindCountsLoading,
    error: kindCountsError,
    data: kindCountsData
  } = useQuery<CountQueryResponse>(
    gql(queries.kindCounts));

  const {
    loading: statusCountsLoading,
    error: statusCountsError,
    data: statusCountsData
  } = useQuery<CountQueryResponse>(
    gql(queries.statusCounts), {
    variables: {
      kind: queryParams.kind || ''
    }
  });

  const {
    loading: tagsLoading,
    error: tagsError,
    data: tagsData
  } = useQuery<TagCountQueryResponse, { type: string }>(
    gql(tagQueries.tags), {
    variables: { type: 'engageMessage' }
  });

  const {
    loading: tagCountsLoading,
    error: tagCountsError,
    data: tagCountsData
  } = useQuery<CountQueryResponse, { kind: string; status: string }>(
    gql(queries.tagCounts), {
    variables: {
      kind: queryParams.kind || '',
      status: queryParams.status || ''
    }
  });

  if (kindCountsError || statusCountsError || tagsError || tagCountsError) {
    const error = checkError([kindCountsError, statusCountsError, tagsError, tagCountsError]);

    return <ErrorMsg>{error.message}</ErrorMsg>;
  };

  if (kindCountsLoading || statusCountsLoading || tagsLoading || tagCountsLoading) {
    return <Spinner objective={true} />;
  };


  const updatedProps = {
    ...props,
    kindCounts: (kindCountsData && kindCountsData.engageMessageCounts) || {},
    statusCounts: (statusCountsData && statusCountsData.engageMessageCounts) || {},
    tags: [tagsData && tagsData.tags] || [] as ITag[],
    tagCounts: (tagCountsData && tagCountsData.engageMessageCounts) || {}
  };

  return <Sidebar {...updatedProps} />;
};

export default withRouter<Props>(SidebarContainer)