import * as React from 'react';
import Onboarding from '../containers/Onboarding';

type Props = {
  entries: any[];
};

class Robot extends React.PureComponent<Props> {
  render() {
    return <Onboarding />;
  }
}

export default Robot;
