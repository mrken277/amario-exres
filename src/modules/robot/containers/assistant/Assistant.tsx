import { JOBS } from 'modules/robot/constants';
import React from 'react';
import Assistant from '../../components/assistant/Assistant';
import { RobotConsumer } from '../RobotContext';

type Props = {
  currentUser: string;
};

function AssistantContainer(props: Props) {
  return (
    <RobotConsumer>
      {({ activeRoute, changeRoute, selectedJobType }) => (
        <Assistant
          {...props}
          jobTypes={JOBS}
          selectedJobType={selectedJobType}
          currentRoute={activeRoute}
          changeRoute={changeRoute}
        />
      )}
    </RobotConsumer>
  );
}

export default AssistantContainer;
