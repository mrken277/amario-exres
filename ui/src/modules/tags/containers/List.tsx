import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import ButtonMutate from 'modules/common/components/ButtonMutate';
import { IButtonMutateProps } from 'modules/common/types';
import { Alert, confirm } from 'modules/common/utils';
import React from 'react';
import List from '../components/List';
import { mutations, queries } from '../graphql';
import { RemoveMutationResponse, TagsQueryResponse } from '../types';

type Props = {
  type: string;
};

const ListContainer = (props: Props) => {
  const { type } = props;

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

  const [removeMutation, { error: removeTagsMutationError }] =
    useMutation<RemoveMutationResponse, { ids: string[] }>(
      gql(mutations.remove), {
      refetchQueries: [
        {
          query: gql(queries.tags),
          variables: { type }
        }
      ]
    }
    );

  const remove = tag => {
    confirm().then(() => {
      removeMutation({ variables: { ids: [tag._id] } })
        .then(() => {
          Alert.success('You successfully deleted a tag');
        })
        .catch(e => {
          Alert.error(e.message);
        });
    });
  };

  if (tagsQueryError || removeTagsMutationError) {
    return <p>Error!</p>;
  }

  if (tagsQueryLoading) {
    return <p>Loading...</p>;
  }

  const renderButton = ({
    name,
    values,
    isSubmitted,
    callback,
    object
  }: IButtonMutateProps) => {
    return (
      <ButtonMutate
        mutation={object ? mutations.edit : mutations.add}
        variables={values}
        callback={callback}
        refetchQueries={getRefetchQueries(type)}
        isSubmitted={isSubmitted}
        type="submit"
        successMessage={`You successfully ${
          object ? 'updated' : 'added'
          } a ${name}`}
      />
    );
  };

  const updatedProps = {
    ...props,
    tags: tagsQueryData ? tagsQueryData.tags : [],
    loading: tagsQueryLoading,
    type,
    remove,
    renderButton
  };

  return <List {...updatedProps} />;
};

const getRefetchQueries = (type: string) => {
  return [
    {
      query: gql(queries.tags),
      variables: { type }
    }
  ];
};

export default ListContainer;
