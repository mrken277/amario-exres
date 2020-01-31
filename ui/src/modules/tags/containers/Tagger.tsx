import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Alert } from 'modules/common/utils';
import React from 'react';
import Tagger from '../components/Tagger';
import { mutations, queries } from '../graphql';
import {
  ITagTypes,
  TagMutationResponse,
  TagMutationVariables,
  TagsQueryResponse
} from '../types';

type Props = {
  // targets can be conversation, customer, company etc ...
  targets?: any[];
  event?: 'onClick' | 'onExit';
  type: ITagTypes | string;
  successCallback?: () => void;
  className?: string;
  refetchQueries?: any[];
};

const TaggerContainer = (props: Props) => {
  const { type, targets = [], successCallback, refetchQueries } = props;

  const {
    loading: tagsQueryLoading,
    error: tagsQueryError,
    data: tagsQueryData
  } = useQuery<TagsQueryResponse, { type: string }>(
    gql(queries.tags),
    {
      variables: { type },
      fetchPolicy: 'network-only'
    }
  );

  const [tagger, { error: tagsTagMutationError }] =
    useMutation<TagMutationResponse, TagMutationVariables>(
      gql(mutations.tagger), { refetchQueries }
    );

  if (tagsQueryError || tagsTagMutationError) {
    return <p>Error!</p>;
  }

  if (tagsQueryLoading) {
    return null;
  }

  const tag = selectedTagIds => {
    const variables = {
      type,
      targetIds: targets.map(t => t._id),
      tagIds: selectedTagIds
    };

    tagger({ variables })
      .then(() => {
        let message = `The ${type} has been tagged!`;

        if (targets.length > 1) {
          message = `Selected ${type}s have been tagged!`;
        }

        Alert.success(message);

        if (successCallback) {
          successCallback();
        }
      })
      .catch(error => {
        Alert.error(error.message);
      });
  };

  const updatedProps = {
    ...props,
    loading: tagsQueryLoading,
    tags: tagsQueryData ? tagsQueryData.tags : [],
    tag
  };

  return <Tagger {...updatedProps} />;
};

export default TaggerContainer;
