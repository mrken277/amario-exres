import React from 'react';
import AssistantDetail from '../components/assistant/AssistantDetail';
import { RobotConsumer } from './RobotContext';

function AssistantDetailContainer() {
  return (
    <RobotConsumer>
      {({ selectedActionDatas, changeRoute, currentAction }) => (
        <AssistantDetail
          currentAction={currentAction}
          datas={selectedActionDatas}
          changeRoute={changeRoute}
        />
      )}
    </RobotConsumer>
  );
}
export default AssistantDetailContainer;
