import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import ErrorMsg from 'modules/common/components/ErrorMsg';
import { Alert, confirm } from 'modules/common/utils';
import { generatePaginationParams } from 'modules/common/utils/router';
import React from 'react';
import ArticleList from '../../components/article/ArticleList';
import { mutations, queries } from '../../graphql';
import {
  ArticlesQueryResponse,
  RemoveArticlesMutationResponse
} from '../../types';

type Props = {
  queryParams: any;
  currentCategoryId: string;
  topicIds: string;
};

function ArticleContainer(props: Props) {
  const {
    queryParams,
    currentCategoryId,
    topicIds
  } = props;

  const {
    data: ArticlesData,
    error: ArticlesError,
    loading: ArticlesLoading,
    refetch: ArticlesRefetch
  } = useQuery<ArticlesQueryResponse, { categoryIds: string[]; page: number; perPage: number }>(
    gql(queries.knowledgeBaseArticles), {
    variables: {
      ...generatePaginationParams(queryParams),
      categoryIds: [currentCategoryId]
    },
    fetchPolicy: 'network-only'
  }
  );

  const [
    removeArticlesMutation,
    { error: knowledgeBaseArticlesRemoveError,
      data: knowledgeBaseArticlesRemoveData }
  ] = useMutation<RemoveArticlesMutationResponse, { _id: string }>(
    gql(mutations.knowledgeBaseArticlesRemove),
    {
      refetchQueries: [
        {
          query: gql(queries.knowledgeBaseArticlesTotalCount),
          variables: { categoryIds: [currentCategoryId] }
        },
        {
          query: gql(queries.knowledgeBaseCategories),
          variables: { topicIds: [topicIds] }
        },
        {
          query: gql(queries.knowledgeBaseCategoryDetail),
          variables: { _id: currentCategoryId }
        }
      ]
    }
  );
  if (ArticlesError) {
    return <ErrorMsg>{ArticlesError.message}</ErrorMsg>;
  };

  // remove action
  const remove = articleId => {
    confirm().then(() => {
      removeArticlesMutation({
        variables: { _id: articleId }
      })
      if (knowledgeBaseArticlesRemoveData) {
        ArticlesRefetch();

        Alert.success('You successfully deleted an article');
      }

      if (knowledgeBaseArticlesRemoveError) {
        Alert.error(knowledgeBaseArticlesRemoveError.message);
      };
    });
  };

  const extendedProps = {
    ...props,
    remove,
    currentCategoryId,
    topicIds,
    queryParams,
    articles: ArticlesData ? ArticlesData.knowledgeBaseArticles : [],
    loading: ArticlesLoading
  };

  return <ArticleList {...extendedProps} />;
}

export default ArticleContainer;
