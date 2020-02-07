import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import ErrorMsg from 'modules/common/components/ErrorMsg';
import Spinner from 'modules/common/components/Spinner';
import { Alert, confirm } from 'modules/common/utils';
import checkError from 'modules/common/utils/checkError';
import React from 'react';
import CategoryList from '../../components/category/CategoryList';
import { mutations, queries } from '../../graphql';
import {
  ArticlesTotalCountQueryResponse,
  CategoriesQueryResponse,
  CategoriesTotalCountQueryResponse,
  RemoveCategoriesMutationResponse
} from '../../types';

type Props = {
  currentCategoryId: string;
  topicIds: string;
};

function KnowledgeBaseContainer(props: Props) {
  const {
    currentCategoryId,
    topicIds
  } = props;

  const {
    data: CategoriesData,
    error: CategoriesError,
    loading: CategoriesLoading,
    refetch: CategoriesRefetch
  } = useQuery<CategoriesQueryResponse, { topicIds: string[] }>(
    gql(queries.knowledgeBaseCategories), {
    variables: {
      topicIds: [topicIds]
    }
  });

  const {
    data: ArticlesTotalCountData,
    error: ArticlesTotalCountError,
    loading: ArticlesTotalCountLoading
  } = useQuery<ArticlesTotalCountQueryResponse, { categoryIds: string[] }>(
    gql(queries.knowledgeBaseArticlesTotalCount), {
    variables: { categoryIds: [currentCategoryId] || '' }
  });

  const {
    data: CategoriesTotalCountData,
    error: CategoriesTotalCountError,
    loading: CategoriesTotalCountLoading
  } = useQuery<CategoriesTotalCountQueryResponse>(
    gql(queries.knowledgeBaseCategoriesTotalCount)
  );

  const [
    removeCategoriesMutation,
    { error: RemoveCategoriesError, data: RemoveCategoriesData }
  ] = useMutation<RemoveCategoriesMutationResponse, { _id: string }>(
    gql(mutations.knowledgeBaseCategoriesRemove));

  if (currentCategoryId) {
    const refetchQueries: any[] = [
      {
        query: gql(queries.knowledgeBaseCategories)
      },
      {
        query: gql(queries.knowledgeBaseTopics)
      }
    ];

    if (currentCategoryId) {
      refetchQueries.push({
        query: gql(queries.knowledgeBaseArticlesTotalCount),
        variables: { categoryIds: [currentCategoryId] }
      });

      refetchQueries.push({
        query: gql(queries.knowledgeBaseCategoryDetail),
        variables: { _id: currentCategoryId },
        skip: () => !currentCategoryId
      });
    }

    return {
      refetchQueries
    };
  };

  if (ArticlesTotalCountError || CategoriesTotalCountError || CategoriesError) {
    const error = checkError([ArticlesTotalCountError, CategoriesTotalCountError, CategoriesError]);

    return <ErrorMsg>{error.message}</ErrorMsg>;
  };

  if (ArticlesTotalCountLoading || CategoriesTotalCountLoading) {
    return <Spinner objective={true} />;
  };

  // remove action
  const remove = categoryId => {
    confirm().then(() => {
      removeCategoriesMutation({
        variables: { _id: categoryId }
      })
      if (RemoveCategoriesData) {
        CategoriesRefetch();

        Alert.success('You successfully deleted a category');
      }

      if (RemoveCategoriesError) {
        Alert.error(RemoveCategoriesError.message);
      };
    });
  };

  const extendedProps = {
    ...props,
    remove,
    currentCategoryId,
    topicIds,
    CategoriesData,
    categories: CategoriesData ? CategoriesData.knowledgeBaseCategories : [],
    loading: CategoriesLoading,
    topicsCount: CategoriesTotalCountData ? CategoriesTotalCountData.knowledgeBaseCategoriesTotalCount : 0,
    articlesCount: ArticlesTotalCountData ? ArticlesTotalCountData.knowledgeBaseArticlesTotalCount : 0
  };

  return <CategoryList {...extendedProps} />;
}

export default KnowledgeBaseContainer;