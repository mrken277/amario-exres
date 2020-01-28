import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { BoardsGetLastQueryResponse, IBoard } from 'modules/boards/types';
import { router as routerUtils } from 'modules/common/utils';
import React from 'react';
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
  history?: any;
};

class HomeContainer extends React.Component<HomeContainerProps & Props> {
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { history, boardId } = nextProps;

    if (!routerUtils.getParam(history, 'boardId') && boardId) {
      routerUtils.setParams(history, { boardId });
    }
  }

  render() {
    return <Home {...this.props} />;
  }
}

// Getting lastBoard id to currentBoard
const LastBoardContainer = (props: Props) => {
  const { type } = props;

  const {
    loading: boardGetLastQueryLoading,
    error: boardGetLastQueryError,
    data: boardGetLastQueryData
  } = useQuery<BoardsGetLastQueryResponse, {}>(
    gql(queries.boardGetLast),
    { variables: { type } }
  );

  const lastBoard = boardGetLastQueryData ? boardGetLastQueryData.boardGetLast : {} as IBoard;

  if (boardGetLastQueryError) {
    return <p>Error!</p>;
  }

  if (boardGetLastQueryLoading) {
    return <p>Loading...</p>;
  }

  const extendedProps = {
    ...props,
    boardId: lastBoard._id
  };

  return <HomeContainer {...extendedProps} />;
};

// Main home component
const MainContainer = (props: Props) => {
  const { history } = props;
  const boardId = routerUtils.getParam(history, 'boardId');

  if (boardId) {
    const extendedProps = { ...props, boardId };

    return <HomeContainer {...extendedProps} />;
  }

  return <LastBoardContainer {...props} />;
};

export default MainContainer;
