import { colors, dimensions } from 'modules/common/styles';
import { darken, lighten } from 'modules/common/styles/color';
import styled from 'styled-components';
import styledTS from 'styled-components-ts';

const Bot = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 10px 0;
  text-align: center;

  &:hover {
    cursor: pointer;
  }

  img {
    width: 45px;
  }
`;

const Group = styled.div`
  margin-bottom: 10px;
`;

const GroupHead = styled.div`
  display: inline-flex;
  background: ${colors.colorWhite};
  border-radius: ${dimensions.unitSpacing}px;
  box-shadow: 0 0 15px 2px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  align-items: stretch;
  font-weight: bold;

  &:hover {
    cursor: pointer;
    box-shadow: 0 0 20px 2px rgba(0, 0, 0, 0.15);
  }
`;

const Count = styledTS<{ color?: string }>(styled.div)`
  padding: 10px 15px;
  color: ${colors.colorWhite};
  background: ${props =>
    `linear-gradient(145deg, ${lighten(
      props.color || colors.colorPrimaryDark,
      40
    )} 0%, ${darken(props.color || colors.colorPrimaryDark, 20)} 100%);;`}
  display: flex;
  align-items: center;
  font-size: 16px;
`;

const Title = styled.div`
  padding: ${dimensions.unitSpacing}px ${dimensions.coreSpacing}px;
`;

const NotifyItem = styled.div`
  margin-top: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
`;

export { Bot, GroupHead, Count, Title, Group, NotifyItem };
