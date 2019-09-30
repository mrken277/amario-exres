import * as React from 'react';
import styled from 'styled-components';

const Welcome = styled.div`
  &:first-child {
    margin-right: 20px;
  }
`;

type Props = {
  onClick?: () => void;
};

type State = {
  show: boolean;
};

class GettingStarted extends React.PureComponent<Props, State> {
  render() {
    const { onClick } = this.props;
    return <Welcome onClick={onClick}>sad</Welcome>;
  }
}

export default GettingStarted;
