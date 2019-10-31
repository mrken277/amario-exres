import React from 'react';
import Assistant from '../../components/assistant/Assistant';
import { RobotConsumer } from '../RobotContext';

type Props = {
  currentUser: string;
};

function AssistantContainer(props: Props) {
  return (
    <RobotConsumer>
      {({ activeRoute, changeRoute }) => (
        <Assistant
          {...props}
          currentRoute={activeRoute}
          changeRoute={changeRoute}
        />
      )}
    </RobotConsumer>
  );
}
export default AssistantContainer;
