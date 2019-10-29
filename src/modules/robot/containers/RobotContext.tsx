import * as React from 'react';
import { IEntry } from '../types';

interface IState {
  activeRoute: string | '';
  currentAction: string;
  selectedActionDatas: IEntry[] | undefined;
}

interface IStore extends IState {
  changeRoute: (route: string) => void;
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
    this.setState({ selectedActionDatas: datas }, () => {
      if (route) {
        this.changeRoute(route);
      }
    });
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

    // this.setState({ isAssistantVisible: !this.state.isAssistantVisible, isOnboardVisible: !this.state.isOnboardVisible })
  };

  public render() {
    return (
      <RobotContext.Provider
        value={{
          ...this.state,
          changeRoute: this.changeRoute,
          toggleContent: this.toggleContent,
          setDatas: this.setDatas,
          setAction: this.setAction
        }}
      >
        {this.props.children}
      </RobotContext.Provider>
    );
  }
}
