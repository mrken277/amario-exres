import Icon from 'modules/common/components/Icon';
import { __ } from 'modules/common/utils';
import {
  Content,
  ContentWrapper,
  Greeting,
  NavButton
} from 'modules/robot/components/styles';
import { JOB_DETAILS } from 'modules/robot/constants';
import { IRobotJobType } from 'modules/robot/types';
import * as React from 'react';
import JobTypeDetail from '../../containers/assistant/JobTypeDetail';
import JobTypeItem from '../../containers/assistant/JobTypeItem';
import ActionItem from '../ActionItem';

type Props = {
  changeRoute: (route: string) => void;
  currentUser: string;
  currentRoute: string;
  selectedJobType?: string;
  jobTypes: IRobotJobType[];
};

class Assistant extends React.Component<Props> {
  renderHome = () => (
    <ContentWrapper>
      <Greeting>
        {__('Hello')}! <b>{this.props.currentUser} </b>
        <span role="img" aria-label="Wave">
          👋
        </span>
        <p>
          {__(
            "I'm a bot that help you declutter database and focus on what's most important"
          )}
        </p>
      </Greeting>

      <ActionItem
        title="Start onboarding"
        description={__('Your step by step guide')}
        color="#de59b2"
        icon="list-2"
        onClick={this.startOnboard}
      />

      {this.props.jobTypes.map((jobType, index) => {
        const jobTypeDetail = JOB_DETAILS[jobType.name];

        return (
          <JobTypeItem
            jobType={jobType.name}
            count={jobType.notificationsCount}
            key={index}
            title={jobTypeDetail.title}
            description={__(jobTypeDetail.description)}
            icon={jobTypeDetail.icon}
            color={jobTypeDetail.color}
          />
        );
      })}
    </ContentWrapper>
  );

  startOnboard = () => {
    this.props.changeRoute('onboardStart');
  };

  renderContent = () => {
    const { currentRoute, selectedJobType } = this.props;

    if (currentRoute === 'assistant-jobTypeDetail' && selectedJobType) {
      return <JobTypeDetail jobType={selectedJobType} />;
    }

    if (currentRoute === 'assistant') {
      return this.renderHome();
    }

    return null;
  };

  onHide = () => {
    this.props.changeRoute('');
  };

  render() {
    return (
      <Content>
        <NavButton onClick={this.onHide} right={true}>
          <Icon icon="times" size={15} />
        </NavButton>
        {this.renderContent()}
      </Content>
    );
  }
}

export default Assistant;
