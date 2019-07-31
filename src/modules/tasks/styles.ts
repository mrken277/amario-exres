import { AddContainer } from 'modules/boards/styles/item';
import { colors, dimensions } from 'modules/common/styles';
import styled from 'styled-components';

const TypeIcon = styled.div`
  display: inline-block;
  padding: ${dimensions.unitSpacing}px ${dimensions.unitSpacing + 5}px;
  margin-bottom: ${dimensions.unitSpacing - 5}px;
  border: 1px solid ${colors.borderDarker};
  border-right: 0;
  cursor: pointer;
  transition: all ease 0.3s;

  &.active {
    background: ${colors.colorShadowGray} !important;
  }

  &:hover {
    background: ${colors.bgActive};
  }

  &:last-child {
    border-right: 1px solid ${colors.borderDarker};
  }
`;

const TaskTypes = styled.div`
  margin-top: ${dimensions.unitSpacing - 5}px;
`;

const DueDate = styled.div`
  position: relative;

  .rdt::focus {
    outline: 0;
  }

  input {
    background: transparent;
    border: 0;
    box-shadow: none;
    border-bottom: 1px solid ${colors.colorShadowGray};
    border-radius: 0;
    padding: 10px 0;
    font-size: 13px;

    &:focus {
      border-color: ${colors.borderPrimary};
      box-shadow: none;
    }
  }
`;

const DateIcon = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  padding: ${dimensions.unitSpacing - 5}px ${dimensions.unitSpacing}px;
  height: 34px;
  background: ${colors.borderPrimary};
  border: 1px solid ${colors.colorShadowGray};
`;

const Container = styled(AddContainer.withComponent('div'))`
  position: relative;
`;

export { TypeIcon, DateIcon, DueDate, TaskTypes, Container };
