import debounce from 'lodash/debounce';
import Icon from 'modules/common/components/Icon';
import { FEATURES } from 'modules/robot/constants';
import Brand from 'modules/robot/containers/Brand';
import Channel from 'modules/robot/containers/Channel';
import * as React from 'react';
import { Link } from 'react-router-dom';
import RTG from 'react-transition-group';
import { IEntry } from '../../types';
import { Close, Item, Links } from './styles';

type Props = {
  children?: React.ReactNode;
  closable?: boolean;
  background?: string;
  delay?: number;
  entry: IEntry;
  action?: string;
  markAsNotified: (id: string) => void;
};

type State = {
  show: boolean;
};

class NotifierItem extends React.Component<Props, State> {
  static defaultProps = {
    delay: 1000
  };

  constructor(props) {
    super(props);

    this.state = { show: false };
  }

  componentDidMount = () => {
    debounce(() => this.setState({ show: true }), this.props.delay)();
  };

  close = () => {
    this.setState({ show: false });
    this.props.markAsNotified(this.props.entry._id);
  };

  generateSuggestContent = (message: string) => {
    return (
      <>
        We found that you haven't used {FEATURES[message].title} feature yet.
        Please <Link to={FEATURES[message].url}>press here</Link> to explore.
      </>
    );
  };

  renderNotifierContent = (content: React.ReactNode) => {
    const { closable = true, background } = this.props;

    return (
      <RTG.CSSTransition
        in={this.state.show}
        appear={true}
        timeout={500}
        classNames="slide-in-small"
        unmountOnExit={true}
      >
        <Item background={background}>
          {closable && (
            <Close onClick={this.close}>
              <Icon icon="times" />
            </Close>
          )}
          <span role="img" aria-label="Up">
            ☝️
          </span>
          <div>
            <h3>Ouch!</h3>
            <p>{content}</p>
          </div>
        </Item>
      </RTG.CSSTransition>
    );
  };

  render() {
    const { entry, action } = this.props;
    const data = entry.data;

    switch (action) {
      case 'featureSuggestion':
        return this.renderNotifierContent(
          this.generateSuggestContent(data.message)
        );

      case 'channelsWithoutIntegration':
        if (data.channelIds.length === 0) {
          return null;
        }

        return this.renderNotifierContent(
          <>
            <Links>
              {data.channelIds.map(id => (
                <Channel
                  key={id}
                  id={id}
                  modalKey="showManageIntegrationModal"
                />
              ))}
            </Links>
            these channels have no integrations.
          </>
        );

      case 'channelsWithoutMembers':
        if (data.channelIds.length === 0) {
          return null;
        }

        return this.renderNotifierContent(
          <>
            <Links>
              {data.channelIds.map(id => (
                <Channel key={id} id={id} modalKey="showChannelAddModal" />
              ))}
            </Links>
            these channels have no members.
          </>
        );

      case 'brandsWithoutIntegration':
        if (data.brandIds.length === 0) {
          return null;
        }

        return this.renderNotifierContent(
          <>
            <Links>
              {data.brandIds.map(id => (
                <Brand key={id} id={id} modalKey="showManageIntegrationModal" />
              ))}
            </Links>
            these brands have no integrations.
          </>
        );

      default:
        return null;
    }
  }
}

export default NotifierItem;
