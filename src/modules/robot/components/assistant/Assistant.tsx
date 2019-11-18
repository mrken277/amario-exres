import Icon from 'modules/common/components/Icon';
import { __ } from 'modules/common/utils';
import {
  Content,
  ContentWrapper,
  Greeting,
  NavButton
} from 'modules/robot/components/styles';
import { JOB_DETAILS } from 'modules/robot/constants';
import * as React from 'react';
import JobItem from '../../containers/assistant/JobItem';
import ActionItem from '../ActionItem';
import JobDetail from './JobDetail';

type Props = {
  changeRoute: (route: string) => void;
  currentUser: string;
  currentRoute: string;
  jobs: string[];
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

      {this.props.jobs.map((job, index) => {
        const jobDetail = JOB_DETAILS[job];

        return (
          <JobItem
            job={job}
            key={index}
            title={jobDetail.title}
            description={__(jobDetail.description)}
            icon={jobDetail.icon}
            color={jobDetail.color}
          />
        );
      })}
    </ContentWrapper>
  );

  startOnboard = () => {
    this.props.changeRoute('onboardStart');
  };

  renderContent = () => {
    const { currentRoute, changeRoute } = this.props;

    if (currentRoute === 'assistant-jobDetail') {
      return <JobDetail changeRoute={changeRoute} />;
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
