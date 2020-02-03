import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { BoardsGetLastQueryResponse, IBoard } from 'modules/boards/types';
import Spinner from 'modules/common/components/Spinner';
import { IRouterProps } from 'modules/common/types';
import { router as routerUtils } from 'modules/common/utils';
import React, { useEffect } from 'react';
import { withRouter } from 'react-router';
import Home from '../components/Home';
import { queries } from '../graphql';
import { IOption } from '../types';

type HomeContainerProps = {
  history?: any;
  boardId: string;
};

type Props = {
  type: string;
  title: string;
  options?: IOption;
};

const HomeContainer = (props: HomeContainerProps & Props) => {
  useEffect(() => {
    const { history, boardId } = props;

    if (!routerUtils.getParam(history, 'boardId') && boardId) {
      routerUtils.setParams(history, { boardId });
    }
  })

  return <Home {...props} />;
}

type MainProps = IRouterProps & Props;

// Getting lastBoard id to currentBoard
const LastBoardContainer = (props: MainProps) => {
  const {
    loading: boardGetLastQueryLoading,
    error: boardGetLastQueryError,
    data: boardGetLastQueryData
  } = useQuery<BoardsGetLastQueryResponse>(gql(queries.boardGetLast),
    { variables: { type: props.type } }
  );

  if (boardGetLastQueryLoading) {
    return <Spinner objective={true} />;
  }

  if (boardGetLastQueryError) {
    return <p>Error!</p>;
  }

  const lastBoard = boardGetLastQueryData ? boardGetLastQueryData.boardGetLast : {} as IBoard;

  const extendedProps = {
    ...props,
    boardId: lastBoard._id
  };

  return <HomeContainer {...extendedProps} />;
};

// Main home component
const MainContainer = (props: MainProps) => {
  const { history } = props;
  const boardId = routerUtils.getParam(history, 'boardId');

  if (boardId) {
    const extendedProps = { ...props, boardId };

    return <HomeContainer {...extendedProps} />;
  }

  return <LastBoardContainer {...props} />;
};

export default withRouter<MainProps>(MainContainer);