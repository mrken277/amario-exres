import debounce from 'lodash/debounce';
import { colors } from 'modules/common/styles';
import * as React from 'react';
import RTG from 'react-transition-group';
import ModulDetail from './ModulDetail';
import ModulItem from './ModulItem';
import { Content, Greeting, ModulRow } from './styles';

type Props = {
  delay?: number;
};

type State = {
  show: boolean;
  activeRoute: string;
};

class Onboard extends React.Component<Props, State> {
  static defaultProps = {
    delay: 120000
  };

  constructor(props) {
    super(props);

    this.state = { show: false, activeRoute: 'feature' };
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
        <Greeting>
          Good morning!{' '}
          <b>
            Ganzorig{' '}
            <span role="img" aria-label="Wave">
              👋
            </span>
          </b>
          <br /> What module do you use usually?
        </Greeting>
        <ModulRow>
          <ModulItem
            vertical={true}
            onClick={this.onClickItem}
            title="Team Inbox"
            description="Combine client and team"
          />
          <ModulItem
            vertical={true}
            onClick={this.onClickItem}
            title="Growth Hack"
            description="Combine client and team"
            color={colors.colorCoreBlue}
            icon="idea"
          />
          <ModulItem
            vertical={true}
            onClick={this.onClickItem}
            title="Messenger"
            description="Combine client and team"
            color={colors.colorCoreBlack}
            icon="followers"
          />
        </ModulRow>
        <ModulRow>
          <ModulItem
            vertical={true}
            onClick={this.onClickItem}
            title="Deal"
            description="Combine client and team"
            color={colors.colorCoreGreen}
            icon="piggybank"
          />
          <ModulItem
            vertical={true}
            onClick={this.onClickItem}
            title="Lead"
            description="Combine client and team"
            color={colors.colorCoreTeal}
            icon="laptop"
          />
          <ModulItem
            vertical={true}
            onClick={this.onClickItem}
            title="Engage"
            description="Combine client and team"
            icon="megaphone"
          />
        </ModulRow>
        <ModulRow>
          <ModulItem
            vertical={true}
            onClick={this.onClickItem}
            title="Contacts"
            description="Combine client and team"
            color={colors.colorSecondary}
            icon="users"
          />
          <ModulItem
            vertical={true}
            onClick={this.onClickItem}
            title="Knowledgebase"
            description="Combine client and team"
            color={colors.colorCoreRed}
            icon="book"
          />
          <ModulItem
            vertical={true}
            onClick={this.onClickItem}
            title="App Store"
            description="Combine client and team"
            color={colors.colorCoreYellow}
            icon="menu"
          />
        </ModulRow>
        <ModulRow>
          <ModulItem
            vertical={true}
            onClick={this.onClickItem}
            title="Tag"
            description="Combine client and team"
            color={colors.colorCoreDarkBlue}
            icon="bookmark"
          />
          <ModulItem
            vertical={true}
            onClick={this.onClickItem}
            title="Segment"
            description="Combine client and team"
            color="pink"
            icon="layout"
          />
          <ModulItem
            vertical={true}
            onClick={this.onClickItem}
            title="Brand"
            description="Combine client and team"
            color={colors.colorPrimary}
            icon="puzzle"
          />
        </ModulRow>
        <ModulRow>
          <ModulItem
            vertical={true}
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

      default:
        return this.renderDetail();
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
