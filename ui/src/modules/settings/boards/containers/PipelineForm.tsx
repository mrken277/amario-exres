import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { BoardsQueryResponse, StagesQueryResponse } from 'modules/boards/types';
import { IPipeline } from 'modules/boards/types';
import Spinner from 'modules/common/components/Spinner';
import { IButtonMutateProps } from 'modules/common/types';
import React from 'react';
import PipelineForm from '../components/PipelineForm';
import { queries } from '../graphql';
import { IOption } from '../types';

type Props = {
  pipeline?: IPipeline;
  boardId?: string;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  closeModal: () => void;
  show: boolean;
  type: string;
  options?: IOption;
};

const PipelineFormContainer = (props: Props) => {
  const { pipeline, type, boardId, renderButton, options } = props;

  const {
    loading: stagesQueryLoading,
    error: stagesQueryError,
    data: stagesQueryData
  } = useQuery<StagesQueryResponse, { pipelineId: string }>(
    gql(queries.stages),
    {
      variables: { pipelineId: pipeline ? pipeline._id : '' },
      fetchPolicy: 'network-only'
    }
  );

  const {
    loading: boardsQueryLoading,
    error: boardsQueryError,
    data: boardsQueryData
  } = useQuery<BoardsQueryResponse>(gql(queries.boards),
    { variables: { type } }
  );

  if (stagesQueryLoading || boardsQueryLoading) {
    return <Spinner />;
  }

  if (stagesQueryError || boardsQueryError) {
    return <p>Error!</p>;
  }

  const stages = stagesQueryData ? stagesQueryData.stages : [];
  const boards = boardsQueryData ? boardsQueryData.boards : [];

  const extendedProps = {
    ...props,
    stages,
    boards,
    boardId,
    renderButton
  };

  const Form = options ? options.PipelineForm : PipelineForm;

  return <Form {...extendedProps} />;
}

export default PipelineFormContainer;
