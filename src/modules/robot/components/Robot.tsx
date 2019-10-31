import { IUser } from 'modules/auth/types';
import * as React from 'react';
import RTG from 'react-transition-group';
import { SUGGESTION_ACTIONS } from '../constants';
import Assistant from '../containers/assistant/Assistant';
import NotifierAction from '../containers/NotifierAction';
import Onboarding from '../containers/Onboarding';
import { getCurrentUserName } from '../utils';
import { Bot, Container } from './styles';

type Props = {
  currentUser: IUser;
  activeRoute: string;
  changeRoute: (route: string) => void;
  toggleContent: () => void;
};

class Robot extends React.Component<Props> {
  renderContent = () => {
    const { currentUser, changeRoute, activeRoute } = this.props;

    return (
      <>
        <RTG.CSSTransition
          in={activeRoute.startsWith('assistant')}
          appear={true}
          timeout={600}
          classNames="slide-in-small"
          unmountOnExit={true}
        >
          <Container>
            <Assistant currentUser={getCurrentUserName(currentUser)} />
          </Container>
        </RTG.CSSTransition>

        <Container>
          {(activeRoute === 'onboardInitial' || activeRoute === 'notifier') &&
            SUGGESTION_ACTIONS.map((action, index) => (
              <NotifierAction key={index} action={action} />
            ))}

          <Onboarding
            show={activeRoute.startsWith('onboard')}
            changeRoute={changeRoute}
            currentUser={currentUser}
            onboardStep={
              activeRoute === 'onboardStart' ? 'featureList' : undefined
            }
          />
        </Container>
      </>
    );
  };

  render() {
    return (
      <>
        {this.renderContent()}
        <RTG.CSSTransition
          in={true}
          appear={true}
          timeout={2600}
          classNames="robot"
        >
          <Bot onClick={this.props.toggleContent}>
            <img src="/images/erxes-bot.svg" alt="ai robot" />
          </Bot>
        </RTG.CSSTransition>
      </>
    );
  }
}

export default Robot;
