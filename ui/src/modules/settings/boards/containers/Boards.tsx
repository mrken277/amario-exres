import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { STORAGE_BOARD_KEY } from 'modules/boards/constants';
import { BoardsQueryResponse } from 'modules/boards/types';
import { getDefaultBoardAndPipelines } from 'modules/boards/utils';
import ButtonMutate from 'modules/common/components/ButtonMutate';
import { IButtonMutateProps, IRouterProps } from 'modules/common/types';
import { Alert, confirm } from 'modules/common/utils';
import routerUtils from 'modules/common/utils/router';
import React from 'react';
import { withRouter } from 'react-router';
import Boards from '../components/Boards';
import { mutations, queries } from '../graphql';
import { IOption, RemoveBoardMutationResponse } from '../types';

type Props = {
  history?: any;
  currentBoardId?: string;
  type: string;
  options?: IOption;
};

type FinalProps = {} & Props & IRouterProps;

const BoardsContainer = (props: FinalProps) => {
  const { history, type } = props;

  const {
    loading: boardsQueryLoading,
    error: boardsQueryError,
    data: boardsQueryData
  } = useQuery<BoardsQueryResponse>(gql(queries.boards),
    { variables: { type } }
  );

  const [removeMutation, { error: boardRemoveMutationError }] =
    useMutation<RemoveBoardMutationResponse, { _id: string }>(
      gql(mutations.boardRemove), {
      refetchQueries: getRefetchQueries()
    });

  if (boardsQueryError || boardRemoveMutationError) {
    return <p>Error!</p>;
  }

  if (boardsQueryLoading) {
    return <p>Loading...</p>;
  }

  const boards = boardsQueryData ? boardsQueryData.boards : [];

  const removeHash = () => {
    const { location } = history;

    if (location.hash.includes('showBoardModal')) {
      routerUtils.removeHash(history, 'showBoardModal');
    }
  };

  // remove action
  const remove = boardId => {
    confirm().then(() => {
      removeMutation({
        variables: { _id: boardId }
      })
        .then(() => {
          // if deleted board is default board
          const { defaultBoards } = getDefaultBoardAndPipelines();
          const defaultBoardId = defaultBoards[type];

          if (defaultBoardId === boardId) {
            delete defaultBoards[type];

            localStorage.setItem(
              STORAGE_BOARD_KEY,
              JSON.stringify(defaultBoards)
            );
          }

          Alert.success('You successfully deleted a board');
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
        mutation={object ? mutations.boardEdit : mutations.boardAdd}
        variables={values}
        callback={callback}
        refetchQueries={getRefetchQueries()}
        isSubmitted={isSubmitted}
        type="submit"
        beforeSubmit={removeHash}
        successMessage={`You successfully ${
          object ? 'updated' : 'added'
          } a ${name}`}
      />
    );
  };

  const extendedProps = {
    ...props,
    boards,
    renderButton,
    remove,
    removeHash,
    loading: boardsQueryLoading
  };

  return <Boards {...extendedProps} />;
}

const getRefetchQueries = () => {
  return ['boards', 'boardGetLast', 'pipelines'];
};

export default withRouter<FinalProps>(BoardsContainer);
