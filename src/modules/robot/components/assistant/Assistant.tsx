import { HomeContainer } from 'modules/common/styles/main';
import { __ } from 'modules/common/utils';
import { Content, Greeting } from 'modules/robot/components/styles';
import ActionItemData from 'modules/robot/containers/ActionItemData';
import * as React from 'react';
import ActionItem from '../ActionItem';

type Props = {
  changeRoute: (route: string) => void;
  currentUser: string;
};

class Assistant extends React.Component<Props> {
  startOnboard = () => {
    this.props.changeRoute('onboardStart');
  };

  render() {
    const { currentUser } = this.props;

    return (
      <Content>
        <HomeContainer>
          <Greeting>
            {__('Hello')}! <b>{currentUser} </b>
            <span role="img" aria-label="Wave">
              👋
            </span>
            <p>
              {__(
                "Which feature do you want to set upI'm a bot that help you declutter database and focus on what's most important"
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

          <ActionItem
            title="Customer merge"
            description={__('Automatically merge same people')}
            icon="users"
            color="#ec542b"
            disabled={true}
          />

          <ActionItemData
            title="Company meta"
            description={__('Automatically retrive company info')}
            color="#3599cb"
            action="fillCompanyInfo"
            icon="briefcase"
            disabled={true}
          />

          <ActionItemData
            title="Customer Scoring"
            description={__('Customer scoring depends on activity')}
            color="#27b553"
            icon="user-2"
            action="customerScoring"
            disabled={true}
          />
        </HomeContainer>
      </Content>
    );
  }
}

export default Assistant;
