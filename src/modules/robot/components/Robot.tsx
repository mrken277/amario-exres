import Notifier from 'modules/notifications/components/Notifier';
import * as React from 'react';
import Onboarding from '../containers/Onboarding';
import Assistant from './assistant/Assistant';
import Onboard from './Onboard';

const Robot = React.memo(() => {
  return (
    <>
      <Onboarding />
      <Notifier />
      <Assistant />
      <Onboard />
    </>
  );
});

export default Robot;
