import * as React from 'react';
import Onboarding from '../containers/Onboarding';
import { Bot } from './styles';

type Props = {
  entries: any[];
};

class Robot extends React.PureComponent<Props> {
  render() {
    return (
      <>
        <Onboarding />
        {/* <Notifier /> */}
        {/* <Assistant /> */}
        {/* <Onboard /> */}
        <Bot>
          <img src="/images/erxes-bot.svg" alt="ai robot" />
        </Bot>
      </>
    );
  }
}

export default Robot;
