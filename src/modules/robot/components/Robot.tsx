import Assistant from 'modules/notifications/components/assistant/Assistant';
import Notifier from 'modules/notifications/components/Notifier';
import * as React from 'react';
import Onboard from './Onboard';

const Robot = React.memo(() => {
  return (
    <>
      <Notifier />
      <Assistant />
      <Onboard />
    </>
  );
});

export default Robot;
