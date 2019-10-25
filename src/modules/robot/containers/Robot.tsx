import { AppConsumer } from 'appContext';
import React from 'react';
import Robot from '../components/Robot';

function RobotContainer() {
  return (
    <AppConsumer>
      {({ currentUser }) => currentUser && <Robot currentUser={currentUser} />}
    </AppConsumer>
  );
}

export default RobotContainer;
