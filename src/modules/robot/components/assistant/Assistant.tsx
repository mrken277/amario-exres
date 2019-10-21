import { HomeContainer } from 'modules/common/styles/main';
import { __ } from 'modules/common/utils';
import ModulItem from 'modules/robot/components/ModulItem';
import { Content, Greeting } from 'modules/robot/components/styles';
import * as React from 'react';

type Props = {
  changeRoute: (route: string) => void;
  currentUserName: string;
};

class Assistant extends React.Component<Props> {
  startOnboard = () => {
    this.props.changeRoute('onboardStart');
  };

  render() {
    const { currentUserName } = this.props;

    return (
      <Content>
        <HomeContainer>
          <Greeting>
            Hello! <b>{currentUserName} </b>
            <span role="img" aria-label="Wave">
              👋
            </span>
            <p>
              I'm a bot that help you declutter database and focus on what's
              most important
            </p>
          </Greeting>

          <ModulItem
            title="Start onboarding"
            description={__('Your step by step guide')}
            color="#de59b2"
            icon="list-2"
            onClick={this.startOnboard}
          />

          <ModulItem
            title="Customer merge"
            description={__('Automatically merge same people')}
            icon="users"
            color="#ec542b"
            disabled={true}
          />
          <ModulItem
            title="Company meta"
            description={__('Automatically retrive company info')}
            color="#3599cb"
            icon="briefcase"
            disabled={true}
          />

          <ModulItem
            title="Customer Scoring"
            description={__('Customer scoring depends on activity')}
            color="#27b553"
            icon="user-2"
            disabled={true}
          />
        </HomeContainer>
      </Content>
    );
  }
}

export default Assistant;
