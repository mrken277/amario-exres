import debounce from 'lodash/debounce';
import { colors, dimensions } from 'modules/common/styles';
import * as React from 'react';
import RTG from 'react-transition-group';
import styled from 'styled-components';
import ModulDetail from './ModulDetail';
import ModulItem from './ModulItem';
import { ModulRow } from './styles';

const Content = styled.div`
  position: fixed;
  padding: ${dimensions.coreSpacing}px;
  border-radius: 10px;
  background: ${colors.bgLight};
  min-width: 300px;
  box-shadow: 0 5px 15px 1px rgba(0, 0, 0, 0.15);
  bottom: 65px;
  left: 15px;
  display: flex;
  max-height: calc(100% - 75px);
  overflow: auto;
  flex-direction: column;
`;

type Props = {
  delay?: number;
};

type State = {
  show: boolean;
  activeRoute: string;
};

class Onboard extends React.Component<Props, State> {
  static defaultProps = {
    delay: 1000
  };

  constructor(props) {
    super(props);

    this.state = { show: false, activeRoute: 'detail' };
  }

  componentDidMount = () => {
    debounce(() => this.setState({ show: true }), this.props.delay)();
  };

  renderDetail = () => <ModulDetail />;

  onClickItem = () => {
    this.setState({ activeRoute: 'detail' });
  };

  renderFeatures = () => {
    return (
      <>
        <ModulRow>
          <ModulItem
            onClick={this.onClickItem}
            title="Team Inbox"
            description="Combine client and team"
          />
          <ModulItem
            onClick={this.onClickItem}
            title="Growth Hack"
            description="Combine client and team"
            color={colors.colorCoreBlue}
            icon="idea"
          />
        </ModulRow>
        <ModulRow>
          <ModulItem
            onClick={this.onClickItem}
            title="Messenger"
            description="Combine client and team"
            color={colors.colorCoreBlack}
            icon="followers"
          />
          <ModulItem
            onClick={this.onClickItem}
            title="Deal"
            description="Combine client and team"
            color={colors.colorCoreGreen}
            icon="piggybank"
          />
        </ModulRow>
        <ModulRow>
          <ModulItem
            onClick={this.onClickItem}
            title="Lead"
            description="Combine client and team"
            color={colors.colorCoreTeal}
            icon="laptop"
          />
          <ModulItem
            onClick={this.onClickItem}
            title="Engage"
            description="Combine client and team"
            icon="megaphone"
          />
        </ModulRow>
        <ModulRow>
          <ModulItem
            onClick={this.onClickItem}
            title="Contacts"
            description="Combine client and team"
            color={colors.colorSecondary}
            icon="users"
          />
          <ModulItem
            onClick={this.onClickItem}
            title="Knowledgebase"
            description="Combine client and team"
            color={colors.colorCoreRed}
            icon="book"
          />
        </ModulRow>
        <ModulRow>
          <ModulItem
            onClick={this.onClickItem}
            title="App Store"
            description="Combine client and team"
            color={colors.colorCoreYellow}
            icon="menu"
          />
          <ModulItem
            onClick={this.onClickItem}
            title="Tag"
            description="Combine client and team"
            color={colors.colorCoreDarkBlue}
            icon="bookmark"
          />
        </ModulRow>
        <ModulRow>
          <ModulItem
            onClick={this.onClickItem}
            title="Segment"
            description="Combine client and team"
            color="pink"
            icon="layout"
          />
          <ModulItem
            onClick={this.onClickItem}
            title="Brand"
            description="Combine client and team"
            color={colors.colorPrimary}
            icon="puzzle"
          />
        </ModulRow>
        <ModulRow>
          <ModulItem
            onClick={this.onClickItem}
            title="Channels"
            description="Combine client and team"
            color="orange"
            icon="idea"
          />
        </ModulRow>
      </>
    );
  };

  renderContent = () => {
    switch (this.state.activeRoute) {
      case 'feature':
        return this.renderFeatures();

      case 'detail':
        return this.renderDetail();

      default:
        return this.renderFeatures();
    }
  };

  render() {
    return (
      <RTG.CSSTransition
        in={this.state.show}
        appear={true}
        timeout={500}
        classNames="slide-in-small"
        unmountOnExit={true}
      >
        <Content>{this.renderContent()}</Content>
      </RTG.CSSTransition>
    );
  }
}

export default Onboard;
