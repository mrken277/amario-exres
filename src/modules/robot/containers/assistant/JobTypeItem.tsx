import React from 'react';
import ActionItem from '../../components/ActionItem';
import { RobotConsumer } from '../RobotContext';

type Props = {
  jobType: string;
  icon?: string;
  color?: string;
  title: string;
  vertical?: boolean;
  description?: string;
  onClick?: () => void;
  isComplete?: boolean;
  disabled?: boolean;
  count?: number;
};

export default class JobTypeItem extends React.Component<Props> {
  render() {
    const { jobType } = this.props;

    return (
      <RobotConsumer>
        {({ selectJobType, changeRoute }) => {
          const handleClick = () => {
            selectJobType(jobType);
            changeRoute('assistant-jobTypeDetail');
          };

          return <ActionItem {...this.props} onClick={handleClick} />;
        }}
      </RobotConsumer>
    );
  }
}
