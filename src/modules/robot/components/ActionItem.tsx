import Icon from 'modules/common/components/Icon';
import { dimensions } from 'modules/common/styles';
import { darken, lighten } from 'modules/common/styles/color';
import colors from 'modules/common/styles/colors';
import { __ } from 'modules/common/utils';
import * as React from 'react';
import styled, { css } from 'styled-components';
import styledTS from 'styled-components-ts';
import { IEntry } from '../types';

const IconContainer = styledTS<{ color?: string }>(styled.div)`
  padding: ${dimensions.unitSpacing}px ${dimensions.coreSpacing}px;
  color: ${colors.colorWhite};
  background: ${props =>
    `linear-gradient(195deg, ${lighten(
      props.color || colors.colorPrimaryDark,
      40
    )} 0%, ${darken(props.color || colors.colorPrimaryDark, 20)} 100%);;`}
  display: flex;
  align-items: center;
  font-size: 16px;
`;

const GroupItem = styledTS<{
  disabled?: boolean;
  vertical?: boolean;
  isComplete?: boolean;
}>(styled.div).attrs({
  title: props => (props.disabled ? __('Nothing new') : undefined)
})`
  display: inline-flex;
  background: ${colors.colorWhite};
  border-radius: ${dimensions.unitSpacing}px;
  box-shadow: 0 0 15px 2px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  align-items: stretch;
  font-weight: bold;
  flex-direction: ${props => props.vertical && 'column'};
  width: 100%;
  margin-bottom: 15px;
  margin-right: ${dimensions.coreSpacing}px;
  max-width: ${props => props.vertical && '30%'};
  min-width: ${props => props.vertical && '130px'};
  position: relative;
  transition: box-shadow ease 0.3s;

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
      opacity: 0.7;

      &:after {
        content: '\\ea3f';
        font-family: 'erxes';
        width: 20px;
        height: 20px;
        border-radius: ${dimensions.unitSpacing}px;
        background: ${colors.colorCoreGreen};
        position: absolute;
        right: ${dimensions.unitSpacing}px;
        top: 7px;
        text-align: center;
        color: ${colors.colorWhite};
      }
    `};

  &:hover {
    cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
    box-shadow: 0 0 20px 2px rgba(0, 0, 0, 0.15);
  }
`;

const Text = styled.div`
  padding: ${dimensions.unitSpacing}px 15px;
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
      border-radius: ${dimensions.unitSpacing}px;
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
      <GroupItem
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
      </GroupItem>
    );
  }
}

export default ActionItem;
