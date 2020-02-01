import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import ButtonMutate from 'modules/common/components/ButtonMutate';
import ErrorMsg from 'modules/common/components/ErrorMsg';
import Spinner from 'modules/common/components/Spinner';
import { IButtonMutateProps } from 'modules/common/types';
import { Alert, confirm } from 'modules/common/utils';
import checkError from 'modules/common/utils/checkError';
import React from 'react';
import KnowledgeList from '../../components/knowledge/KnowledgeList';
import { mutations, queries } from '../../graphql';
import {
  RemoveTopicsMutation,
  TopicsQueryResponse,
  TopicsTotalCountQueryResponse
} from '../../types';

type Props = {
  queryParams: any;
  currentCategoryId: string;
  articlesCount: number;
};

function KnowledgeBaseContainer(props: Props) {
  const {
    currentCategoryId,
    queryParams,
    articlesCount
  } = props;

  const {
    data: topicsData,
    error: topicsError,
    loading: topicsLoading,
    refetch: topicRefetch
  } = useQuery<TopicsQueryResponse>(
    gql(queries.knowledgeBaseTopics), {
    fetchPolicy: 'network-only'
  });

  const {
    data: topicsCountData,
    error: topicsCountError,
    loading: topicsCountLoading,
    refetch: topicCountRefetch
  } = useQuery<TopicsTotalCountQueryResponse>(
    gql(queries.knowledgeBaseTopicsTotalCount));


  const [
    removeTopicsMutation,
    { loading: RemoveTopicsLoading, error: RemoveTopicsError, data: RemoveTopicsData }
  ] = useMutation<RemoveTopicsMutation, { _id: string }>(
    gql(mutations.knowledgeBaseTopicsRemove),
    {
      refetchQueries: !currentCategoryId
        ? []
        : [
          {
            query: gql(queries.knowledgeBaseArticlesTotalCount),
            variables: { categoryIds: [currentCategoryId] }
          },
          {
            query: gql(queries.knowledgeBaseCategoryDetail),
            variables: { _id: currentCategoryId }
          }
        ]
    }
  );

  if (topicsError || topicsCountError) {
    const error = checkError([topicsError, topicsCountError]);

    return <ErrorMsg>{error.message}</ErrorMsg>;
  }

  if (topicsCountLoading || RemoveTopicsLoading) {
    return <Spinner objective={true} />;
  }

  // remove action
  const remove = topicId => {
    confirm().then(() => {
      removeTopicsMutation({
        variables: { _id: topicId }
      })
      if (RemoveTopicsData) {
        topicRefetch();
        topicCountRefetch();

        Alert.success('You successfully deleted a knowledge base');
      }
      if (RemoveTopicsError) {
        Alert.error(RemoveTopicsError.message);
      };
    });
  };

  const renderButton = ({
    name,
    values,
    isSubmitted,
    callback,
    object
  }: IButtonMutateProps) => {
    const callBackResponse = () => {
      topicRefetch();
      topicCountRefetch();

      if (callback) {
        callback();
      }
    };

    return (
      <ButtonMutate
        mutation={
          object
            ? mutations.knowledgeBaseTopicsEdit
            : mutations.knowledgeBaseTopicsAdd
        }
        variables={values}
        callback={callBackResponse}
        isSubmitted={isSubmitted}
        type="submit"
        successMessage={`You successfully ${
          object ? 'updated' : 'added'
          } a ${name}`}
      />
    );
  };

  const extendedProps = {
    ...props,
    remove,
    renderButton,
    currentCategoryId,
    queryParams,
    articlesCount,
    topics: topicsData ? topicsData.knowledgeBaseTopics : [],
    loading: topicsLoading,
    refetch: topicRefetch,
    topicsCount: topicsCountData ? topicsCountData.knowledgeBaseTopicsTotalCount : 0
  };

  return <KnowledgeList {...extendedProps} />;
}

export default KnowledgeBaseContainer;
