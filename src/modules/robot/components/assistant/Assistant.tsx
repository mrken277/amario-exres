import Icon from 'modules/common/components/Icon';
import { __ } from 'modules/common/utils';
import {
  Content,
  ContentWrapper,
  Greeting,
  NavButton
} from 'modules/robot/components/styles';
import ActionItemData from 'modules/robot/containers/ActionItemData';
import * as React from 'react';
import AssistantDetail from '../../containers/assistant/AssistantDetail';
import ActionItem from '../ActionItem';

type Props = {
  changeRoute: (route: string) => void;
  currentUser: string;
  currentRoute: string;
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

      <ActionItemData
        title="Customer merge"
        description={__('Automatically merge same people')}
        icon="users"
        color="#ec542b"
        action="mergeCustomers"
      />

      <ActionItemData
        title="Company meta"
        description={__('Automatically retrive company info')}
        color="#3599cb"
        action="fillCompanyInfo"
        icon="briefcase"
      />

      <ActionItemData
        title="Customer Scoring"
        description={__('Customer scoring depends on activity')}
        color="#27b553"
        icon="user-2"
        action="customerScoring"
      />
    </ContentWrapper>
  );

  startOnboard = () => {
    this.props.changeRoute('onboardStart');
  };

  renderContent = () => {
    const { currentRoute } = this.props;

    if (currentRoute === 'assistantDetail') {
      return <AssistantDetail />;
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
