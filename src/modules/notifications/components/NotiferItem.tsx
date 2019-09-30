import debounce from 'lodash/debounce';
import Icon from 'modules/common/components/Icon';
import { colors, dimensions } from 'modules/common/styles';
import * as React from 'react';
import RTG from 'react-transition-group';
import styled from 'styled-components';
import styledTS from 'styled-components-ts';

const Item = styledTS<{ background?: string }>(styled.div)`
  padding: ${dimensions.coreSpacing}px;
  border-radius: 10px;
  color: ${colors.colorWhite};
  background: ${props => props.background || colors.colorCoreBlue};
  max-width: 300px;
  box-shadow: 0 0 15px 2px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
  position: relative;
  display: flex;

  > span {
    margin-right: 10px;
  }

  a {
    color: ${colors.colorWhite};
    text-decoration: underline;
  }

  h3 {
    margin-top: 0;
    font-size: 14px;
  }

  p {
    margin: 0;
  }
`;

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
  children: React.ReactNode;
  closable?: boolean;
  background?: string;
  delay?: number;
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

  render() {
    const { children, closable = true, background } = this.props;

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

          {children}
        </Item>
      </RTG.CSSTransition>
    );
  }
}

export default NotifierItem;
