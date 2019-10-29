import { AppConsumer } from 'appContext';
import { IUser } from 'modules/auth/types';
import React from 'react';
import Robot from '../components/Robot';
import { RobotConsumer, RobotProvider } from './RobotContext';

type Props = {
  currentUser: IUser;
};

const WithRoute = (props: Props) => (
  <RobotProvider>
    <RobotConsumer>
      {({ changeRoute, activeRoute, toggleContent }) => (
        <Robot
          {...props}
          changeRoute={changeRoute}
          activeRoute={activeRoute}
          toggleContent={toggleContent}
        />
      )}
    </RobotConsumer>
  </RobotProvider>
);

function robotContainer() {
  return (
    <AppConsumer>
      {({ currentUser }) =>
        currentUser && <WithRoute currentUser={currentUser} />
      }
    </AppConsumer>
  );
}
export default robotContainer;
