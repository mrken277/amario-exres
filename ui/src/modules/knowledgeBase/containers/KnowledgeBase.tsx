import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import ErrorMsg from 'modules/common/components/ErrorMsg';
import Spinner from 'modules/common/components/Spinner';
import { IRouterProps } from 'modules/common/types';
import { router as routerUtils, withProps } from 'modules/common/utils';
import checkError from 'modules/common/utils/checkError';
import queryString from 'query-string';
import React, { useEffect } from 'react';
import { withRouter } from 'react-router';
import KnowledgeBaseComponent from '../components/KnowledgeBase';
import { queries } from '../graphql';
import {
  ArticlesTotalCountQueryResponse,
  CategoryDetailQueryResponse,
  ICategory,
  LastCategoryQueryResponse
} from '../types';

type Props = {
  queryParams: any;
  currentCategoryId: string;
};

type FinalProps = {
} & Props &
  IRouterProps;

const KnowledgeBaseContainer = (props: FinalProps) => {
  const { currentCategoryId } = props;
  const {
    data: categoryDetailData,
    error: categoryDetailError,
    loading: categoryDetailLoading
  } = useQuery<CategoryDetailQueryResponse, { _id: string }>(
    gql(queries.knowledgeBaseCategoryDetail), {
    variables: { _id: currentCategoryId },
    fetchPolicy: 'network-only',
    skip: !currentCategoryId
  });

  const {
    data: articlesCountData,
    error: articlesCountError,
    loading: articlesCountLoading
  } = useQuery<ArticlesTotalCountQueryResponse, { categoryIds: string[] }>(
    gql(queries.knowledgeBaseArticlesTotalCount), {
    variables: { categoryIds: [currentCategoryId] },
    skip: !currentCategoryId
  }
  );

  const articlesCount =
    articlesCountData && articlesCountData.knowledgeBaseArticlesTotalCount;

  const currentCategory =
    categoryDetailData && categoryDetailData.knowledgeBaseCategoryDetail;

  if (categoryDetailError || articlesCountError) {
    const error = checkError([categoryDetailError, articlesCountError]);

    return <ErrorMsg>{error.message}</ErrorMsg>;
  }

  if (categoryDetailLoading || articlesCountLoading) {
    return <Spinner objective={true} />;
  }

  const updatedProps = {
    ...props,
    articlesCount: articlesCount || 0,
    currentCategory: currentCategory || ({} as ICategory)
  };

  return <KnowledgeBaseComponent {...updatedProps} />;
};

type WithCurrentIdProps = {
  history: any;
  queryParams: any;
} & IRouterProps;

const WithLastCategory = (nextProps: WithCurrentIdProps) => {
  const { queryParams } = nextProps;

  const {
    data: categoriesGetLastData,
    error: categoriesGetLastError,
    loading: categoriesGetLastLoading
  } = useQuery<LastCategoryQueryResponse, WithCurrentIdProps>(
    gql(queries.categoriesGetLast), {
    fetchPolicy: 'network-only',
    skip: queryParams.id
  });

  useEffect(() => {
    const {
      history,
      queryParams: { _id }
    } = nextProps;

    if (!categoriesGetLastData) {
      return;
    }

    const { knowledgeBaseCategoriesGetLast, loading } =
      categoriesGetLastData;

    if (!_id && knowledgeBaseCategoriesGetLast && !loading) {
      routerUtils.setParams(
        history,
        {
          id: knowledgeBaseCategoriesGetLast._id
        },
        true
      );
    }
  });

  if (categoriesGetLastError) {
    return <ErrorMsg>{categoriesGetLastError.message}</ErrorMsg>;
  }

  if (categoriesGetLastLoading) {
    return <Spinner objective={true} />;
  };

  const {
    queryParams: { id }
  } = nextProps;

  const updatedProps = {
    ...nextProps,
    currentCategoryId: id || ''
  };

  return <KnowledgeBaseContainer {...updatedProps} />;
}

const WithQueryParams = (props: IRouterProps) => {
  const { location } = props;
  const queryParams = queryString.parse(location.search);

  const extendedProps = { ...props, queryParams };

  return <WithLastCategory {...extendedProps} />;
};

export default withProps<{}>(withRouter<IRouterProps>(WithQueryParams));
