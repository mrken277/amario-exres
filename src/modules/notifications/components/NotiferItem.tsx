import debounce from 'lodash/debounce';
import Icon from 'modules/common/components/Icon';
import { colors, dimensions } from 'modules/common/styles';
import * as React from 'react';
import RTG from 'react-transition-group';
import styled from 'styled-components';

const Item = styled.div`
  padding: 15px ${dimensions.coreSpacing}px;
  border-radius: 10px;
  color: ${colors.colorWhite};
  background: ${colors.colorCoreBlue};
  width: 300px;
  box-shadow: 0 0 15px 2px rgba(0, 0, 0, 0.1);
  margin-top: 10px;
  position: relative;
`;

const Close = styled.div`
  position: absolute;
  right: 10px;
  top: 10px;
`;

type Props = {
  children: React.ReactNode;
  closable?: boolean;
  delay?: number;
};

type State = {
  show: boolean;
};

class NotifierItem extends React.Component<Props, State> {
  static defaultProps = {
    delay: 2000
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
    const { children, closable = true } = this.props;

    return (
      <RTG.CSSTransition
        in={this.state.show}
        appear={true}
        timeout={500}
        classNames="slide-in-small"
        unmountOnExit={true}
      >
        <Item>
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
