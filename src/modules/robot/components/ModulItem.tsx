import Icon from 'modules/common/components/Icon';
import {
  Count,
  GroupHead
} from 'modules/notifications/components/assistant/styles';
import * as React from 'react';
import styled from 'styled-components';

const Modul = styled(GroupHead)`
  &:first-child {
    margin-right: 20px;
  }
`;

const IconContainer = styled(Count)`
  padding: 10px 20px;
`;

const Text = styled.div`
  padding: 10px 15px;
  font-weight: normal;
  flex: 1;

  h4 {
    font-size: 13px;
    margin-top: 0;
    margin-bottom: 5px;
  }

  p {
    font-size: 11px;
    margin: 0;
  }
`;

type Props = {
  icon?: string;
  color?: string;
  title: string;
  description?: string;
  onClick?: () => void;
};

type State = {
  show: boolean;
};

class ModulItem extends React.PureComponent<Props, State> {
  render() {
    const { icon = 'chat', title, description, color, onClick } = this.props;
    return (
      <Modul onClick={onClick}>
        <IconContainer color={color}>
          <Icon icon={icon} />
        </IconContainer>
        <Text>
          <h4>{title}</h4>
          <p>{description}</p>
        </Text>
      </Modul>
    );
  }
}

export default ModulItem;
