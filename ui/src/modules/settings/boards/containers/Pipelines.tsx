import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { BoardDetailQueryResponse, IBoard, PipelinesQueryResponse } from 'modules/boards/types';
import ButtonMutate from 'modules/common/components/ButtonMutate';
import Spinner from 'modules/common/components/Spinner';
import { IButtonMutateProps } from 'modules/common/types';
import { __, Alert, confirm } from 'modules/common/utils';
import React from 'react';
import Pipelines from '../components/Pipelines';
import { mutations, queries } from '../graphql';
import {
  IOption,
  RemovePipelineMutationResponse,
  RemovePipelineMutationVariables,
  UpdateOrderPipelineMutationResponse,
  UpdateOrderPipelineMutationVariables
} from '../types';

type Props = {
  boardId: string;
  type: string;
  options?: IOption;
};

const PipelinesContainer = (props: Props) => {
  const { boardId } = props;

  const {
    loading: pipelinesQueryLoading,
    error: pipelinesQueryError,
    data: pipelinesQueryData,
    refetch: pipelinesQueryRefetch
  } = useQuery<PipelinesQueryResponse, { boardId: string }>(
    gql(queries.pipelines),
    {
      variables: { boardId },
      fetchPolicy: 'network-only'
    }
  );

  const {
    loading: boardDetailQueryLoading,
    error: boardDetailQueryError,
    data: boardDetailQueryData
  } = useQuery<BoardDetailQueryResponse>(gql(queries.boardDetail),
    {
      variables: { _id: boardId },
      fetchPolicy: 'network-only'
    }
  );

  const [removePipelineMutation, { error: removePipelineMutationError }] =
    useMutation<RemovePipelineMutationResponse, RemovePipelineMutationVariables>(
      gql(mutations.pipelineRemove));

  const [pipelinesUpdateOrderMutation, { error: pipelinesUpdateOrderError }] =
    useMutation<UpdateOrderPipelineMutationResponse, UpdateOrderPipelineMutationVariables>(
      gql(mutations.pipelinesUpdateOrder));

  if (pipelinesQueryLoading || boardDetailQueryLoading) {
    return <Spinner />;
  }

  if (pipelinesQueryError || boardDetailQueryError || removePipelineMutationError || pipelinesUpdateOrderError) {
    return <p>Error!</p>;
  }

  const pipelines = pipelinesQueryData ? pipelinesQueryData.pipelines : [];

  // remove action
  const remove = pipelineId => {
    confirm().then(() => {
      removePipelineMutation({
        variables: { _id: pipelineId }
      })
        .then(() => {
          pipelinesQueryRefetch({ boardId })

          const msg = `${__(`You successfully deleted a`)} ${__(
            'pipeline'
          )}.`;

          Alert.success(msg);
        })
        .catch(error => {
          Alert.error(error.message);
        });
    });
  };

  const renderButton = ({
    name,
    values,
    isSubmitted,
    callback,
    object
  }: IButtonMutateProps) => {
    return (
      <ButtonMutate
        mutation={object ? mutations.pipelineEdit : mutations.pipelineAdd}
        variables={values}
        callback={callback}
        refetchQueries={getRefetchQueries(boardId)}
        isSubmitted={isSubmitted}
        type="submit"
        successMessage={`You successfully ${
          object ? 'updated' : 'added'
          } a ${name}`}
      />
    );
  };

  const updateOrder = orders => {
    pipelinesUpdateOrderMutation({
      variables: { orders }
    }).catch(error => {
      Alert.error(error.message);
    });
  };

  const extendedProps = {
    ...props,
    pipelines,
    refetch: pipelinesQueryRefetch,
    loading: pipelinesQueryLoading,
    remove,
    renderButton,
    updateOrder,
    currentBoard: boardDetailQueryData ? boardDetailQueryData.boardDetail : {} as IBoard,
  };

  return <Pipelines {...extendedProps} />;
}

const getRefetchQueries = (boardId: string) => {
  return [
    { query: gql(queries.pipelines), variables: { boardId: boardId || '' } }
  ];
};

export default PipelinesContainer;