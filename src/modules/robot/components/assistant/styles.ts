import { colors, dimensions } from 'modules/common/styles';
import styled from 'styled-components';

const NotifyList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NotifyItem = styled.li`
  margin-top: ${dimensions.unitSpacing}px;
  padding-bottom: ${dimensions.unitSpacing}px;
  border-bottom: 1px solid ${colors.borderPrimary};
  display: flex;
  flex-direction: row;

  > i {
    padding: 0 ${dimensions.unitSpacing}px 0 0;
    color: ${colors.colorCoreRed};
  }

  a {
    text-decoration: underline;
    font-weight: 500;
    margin-right: 5px;
    text-transform: capitalize;
  }

  &:last-child {
    border: none;
  }
`;

export { NotifyList, NotifyItem };
