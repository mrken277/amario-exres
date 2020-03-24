import { colors, dimensions, typography } from 'modules/common/styles';
import { SidebarList } from 'modules/layout/styles';
import styled from 'styled-components';
import styledTS from 'styled-components-ts';

const Info = styled.div`
  margin-top: 5px;
  white-space: normal;

  > span {
    font-weight: normal;
  }
`;

const InfoTitle = styled.span`
  font-weight: 500;
  margin-bottom: 5px;
  margin-right: 10px;
`;

const InfoDetail = styled.p`
  margin: 0;
  display: block;
  font-size: 12px;
  font-weight: normal;
  color: ${colors.colorCoreGray};
`;

const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 ${dimensions.coreSpacing}px ${dimensions.unitSpacing}px;

  > a,
  button {
    flex: 1;
  }

  > div {
    margin-left: 10px;
  }
`;

const Action = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: ${dimensions.unitSpacing}px;
`;

const List = styled(SidebarList)`
  li {
    border-bottom: 1px solid ${colors.borderPrimary};
    color: ${colors.textPrimary};
    white-space: normal;
    padding: 10px 20px;

    span {
      color: ${colors.colorCoreLightGray};
      margin: 0;
    }

    &:last-child {
      border: none;
    }
  }
`;

const InfoAvatar = styled.img`
  width: 40px;
  border-radius: 40px;
`;

const Contact = styled.div`
  display: flex;
  align-items: center;
  border-top: 1px solid ${colors.borderPrimary};
  padding: 10px 20px;
  position: relative;

  span {
    margin-right: ${dimensions.unitSpacing}px;
  }

  i {
    color: ${colors.colorCoreLightGray};
    cursor: pointer;
    position: absolute;
    right: ${dimensions.coreSpacing}px;
    top: 15px;
  }
`;

const NameContainer = styled.div`
  flex: 1;
  word-break: break-word;

  p {
    color: ${colors.colorCoreLightGray};
    margin: 0;
    font-size: 12px;
  }
`;

const Name = styledTS<{ fontSize?: number }>(styled.div)`
  font-size: ${props => props.fontSize && `${props.fontSize}px`};
  font-weight: 500;

  i {
    margin-left: 10px;
    transition: all 0.3s ease;
    color: ${colors.colorCoreLightGray};

    &:hover {
      cursor: pointer;
      color: ${colors.colorCoreGray};
    }
  }
`;


const CustomerState = styled.div`
  text-transform: capitalize;
  text-align: center;
  font-size: ${typography.fontSizeUppercase}px;
  line-height: 20px;
  font-weight: 500;
  color: ${colors.colorCoreGray};
`;

const TabContent = styled.div`
  padding: ${dimensions.coreSpacing}px;
`;

const ClickableRow = styled.span`
  cursor: pointer;

  &:hover {
    color: ${colors.textSecondary};
  }
`;

const BooleanStatus = styledTS<{ isTrue?: boolean }>(styled.div)`
  text-align: center;

  i {
    font-size: 16px;
    color: ${props =>
      props.isTrue ? colors.colorCoreGreen : colors.colorCoreRed};
  }
`;

const UserHeader = styled.div`
  margin: 0 -10px;
  padding: 10px 0;
`;

const MailBox = styled.div`
  background: ${colors.colorWhite};
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  transition: all ease 0.3s;
`;

const Status = styledTS<{ verified: boolean }>(styled.span)`
  background: ${props => props.verified ? colors.colorCoreGreen : colors.bgGray};
  color: ${props => props.verified ? colors.colorWhite : colors.textSecondary};
  width: 18px;
  height: 18px;
  text-align: center;
  border-radius: 9px;
  font-size: 11px;
  line-height: 18px;
`;

export {
  InfoTitle,
  InfoDetail,
  Info,
  Actions,
  Action,
  List,
  InfoAvatar,
  Contact,
  NameContainer,
  Name,
  TabContent,
  ClickableRow,
  BooleanStatus,
  CustomerState,
  UserHeader,
  MailBox,
  Status
};
