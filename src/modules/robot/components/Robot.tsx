import Notifier from 'modules/notifications/components/Notifier';
import * as React from 'react';
import Assistant from './assistant/Assistant';
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
