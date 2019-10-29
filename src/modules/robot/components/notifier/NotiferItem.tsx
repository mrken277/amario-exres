import debounce from 'lodash/debounce';
import Icon from 'modules/common/components/Icon';
import * as React from 'react';
import RTG from 'react-transition-group';
import styled from 'styled-components';
import { IEntry } from '../../types';
import { Item } from '../styles';

const Close = styled.div`
  position: absolute;
  right: 10px;
  top: 5px;
  font-size: 16px;
  transition: transform 0.2s ease;

  &:hover {
    cursor: pointer;
    transform: scale(1.1);
  }
`;

type Props = {
  children?: React.ReactNode;
  closable?: boolean;
  background?: string;
  delay?: number;
  entry: IEntry;
  action?: string;
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
  };

  renderItemContent = (content: React.ReactNode) => {
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
          <span role="img" aria-label="Wave">
            👋
          </span>
          <div>
            <h3>Oops!</h3>
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
        return this.renderItemContent(<>{data.message}</>);

      case 'channelsWithoutIntegration':
        if (data.channelIds.length === 0) {
          return null;
        }

        return this.renderItemContent(<>{data.channelIds}</>);

      case 'brandsWithoutIntegration':
        if (data.brandIds.length === 0) {
          return null;
        }

        return this.renderItemContent(<>{data.brandIds}</>);

      default:
        return null;
    }
  }
}

export default NotifierItem;
