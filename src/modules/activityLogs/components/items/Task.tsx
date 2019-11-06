import dayjs from 'dayjs';
import { ACTIVITY_LOG_ITEMS_STYLES } from 'modules/activityLogs/constants';
import {
  ActivityDate,
  ActivityIcon,
  ActivityRow,
  FlexBody,
  FlexContent
} from 'modules/activityLogs/styles';
import Icon from 'modules/common/components/Icon';
import Tip from 'modules/common/components/Tip';
import { ITask } from 'modules/tasks/types';
import React from 'react';

const { TASK } = ACTIVITY_LOG_ITEMS_STYLES;

type Props = {
  activity: any;
  task: ITask;
};

class InternalNote extends React.Component<Props> {
  renderContent = () => {
    const { activity, task } = this.props;
    const { createdUser } = activity;

    let userName = 'Unknown';

    if (createdUser) {
      userName = createdUser.details ? createdUser.details.fullName : 'Unknown';
    }

    return (
      <span>
        <strong>{userName}</strong> is related <a>{task.name}</a> task
      </span>
    );
  };

  render() {
    const { activity } = this.props;

    return (
      <ActivityRow key={Math.random()}>
        <ActivityIcon color={TASK.color}>
          <Icon icon={TASK.icon} />
        </ActivityIcon>
        <React.Fragment>
          <FlexContent>
            <FlexBody>
              <strong>Task activity</strong>
            </FlexBody>
            <Tip text={dayjs(activity.createdAt).format('llll')}>
              <ActivityDate>
                {dayjs(activity.createdAt).format('MMM D, h:mm A')}
              </ActivityDate>
            </Tip>
          </FlexContent>
          {this.renderContent()}
        </React.Fragment>
      </ActivityRow>
    );
  }
}

export default InternalNote;
