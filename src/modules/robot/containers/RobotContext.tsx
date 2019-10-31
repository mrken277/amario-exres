import apolloClient from 'apolloClient';
import gql from 'graphql-tag';
import Alert from 'modules/common/utils/Alert';
import * as React from 'react';
import { mutations } from '../graphql';
import { IEntry } from '../types';

interface IState {
  activeRoute: string | '';
  currentAction: string;
  selectedActionDatas: IEntry[] | undefined;
}

interface IStore extends IState {
  changeRoute: (route: string) => void;
  markAsNotified: (id: string) => void;
  toggleContent: () => void;
  setDatas: (data: IEntry[], route?: string) => void;
  setAction: (action: string) => void;
}

const RobotContext = React.createContext({} as IStore);

export const RobotConsumer = RobotContext.Consumer;

export class RobotProvider extends React.Component<{}, IState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      activeRoute: 'onboardInitial',
      selectedActionDatas: undefined,
      currentAction: ''
    };
  }

  changeRoute = (route: string) => {
    this.setState({ activeRoute: route });
  };

  setDatas = (datas: IEntry[], route?: string) => {
    if (datas.length !== 0) {
      this.setState({ selectedActionDatas: datas }, () => {
        if (route) {
          this.changeRoute(route);
        }
      });
    }
  };

  setAction = (action: string) => {
    this.setState({ currentAction: action });
  };

  toggleContent = () => {
    // hide content
    if (this.state.activeRoute.startsWith('assistant')) {
      return this.changeRoute('');
    }

    return this.changeRoute('assistant');
  };

  markNotified = (id: string) => {
    apolloClient
      .mutate({
        mutation: gql(mutations.markAsNotified),
        variables: { _id: id }
      })
      .then(() => {
        Alert.success('Successfully');
      });
  };

  public render() {
    return (
      <RobotContext.Provider
        value={{
          ...this.state,
          changeRoute: this.changeRoute,
          toggleContent: this.toggleContent,
          setDatas: this.setDatas,
          setAction: this.setAction,
          markAsNotified: this.markNotified
        }}
      >
        {this.props.children}
      </RobotContext.Provider>
    );
  }
}
