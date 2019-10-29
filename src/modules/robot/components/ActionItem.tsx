import Icon from 'modules/common/components/Icon';
import colors from 'modules/common/styles/colors';
import * as React from 'react';
import styled, { css } from 'styled-components';
import { IEntry } from '../types';
import { Count, GroupHead } from './assistant/styles';

const IconContainer = styled(Count)`
  padding: 10px 20px;
`;

const Modul = styled(GroupHead)`
  width: 100%;
  margin-bottom: 15px;
  margin-right: 20px;
  max-width: ${props => props.vertical && '30%'};
  min-width: ${props => props.vertical && '130px'};

  &:last-child {
    margin-right: 0;
  }

  &:nth-child(3n + 2) {
    margin-right: 0;
  }

  ${props =>
    props.vertical &&
    css`
      ${IconContainer} {
        padding: 5px 20px;
      }
    `};

  ${props =>
    props.isComplete &&
    css`
      transform: scale(0.9);
      opacity: 0.6;
    `};
`;

const Text = styled.div`
  padding: 10px 15px;
  font-weight: normal;
  flex: 1;

  h4 {
    font-size: 13px;
    margin: 0;
    text-transform: capitalize;

    span {
      background: ${colors.colorCoreRed};
      color: ${colors.colorWhite};
      font-size: 8px;
      padding: 2px 5px;
      border-radius: 10px;
      position: relative;
      top: -2px;
    }
  }

  p {
    font-size: 11px;
    margin: 5px 0 0;
  }
`;

type Props = {
  icon?: string;
  color?: string;
  title: string;
  vertical?: boolean;
  description?: string;
  onClick?: () => void;
  isComplete?: boolean;
  disabled?: boolean;
  entries?: IEntry[];
  count?: number | null;
};

type State = {
  show: boolean;
};

class ActionItem extends React.Component<Props, State> {
  handleClick = () => {
    const { onClick } = this.props;

    if (onClick) {
      return onClick();
    }
  };

  render() {
    const {
      icon = 'chat',
      title,
      description,
      color,
      vertical,
      isComplete,
      disabled,
      count
    } = this.props;

    return (
      <Modul
        onClick={this.handleClick}
        vertical={vertical}
        isComplete={isComplete}
        disabled={disabled}
      >
        <IconContainer color={color}>
          <Icon icon={icon} />
        </IconContainer>
        <Text>
          <h4>
            {title} {count && <span>{count}</span>}
          </h4>
          {!vertical && <p>{description}</p>}
        </Text>
      </Modul>
    );
  }
}

export default ActionItem;
