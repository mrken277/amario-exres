import { colors, dimensions } from 'modules/common/styles';
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
    width: 42px;
  }
`;

const Title = styled.h2`
  margin: 0 0 ${dimensions.coreSpacing}px;
  font-size: 16px;
  text-transform: capitalize;
`;

const ContentWrapper = styled.div`
  width: 320px;
`;

const Greeting = styled.div`
  margin-bottom: 20px;
  font-size: 15px;

  span {
    margin-left: 5px;
  }

  p {
    margin-top: ${dimensions.unitSpacing}px;
    font-size: 13px;
  }
`;

const NavButton = styledTS<{ right?: boolean }>(styled.div)`
  margin-bottom: ${dimensions.unitSpacing}px;
  border-radius: ${dimensions.coreSpacing}px;
  display: inline-block;
  text-align: center;
  width: 25px;
  height: 25px;
  margin-left: ${props => !props.right && '-7px'};;
  margin-top: -5px;
  float: ${props => props.right && 'right'};
  background: ${props => props.right && colors.bgActive};
  position: sticky;
  top: 0;

  &:hover {
    background: ${props =>
      props.right ? colors.borderDarker : colors.bgActive};
    cursor: pointer;
  }

  i {
    line-height: 25px;
  }
`;

const Container = styled.div`
  position: fixed;
  min-width: 300px;
  max-width: 500px;
  bottom: 65px;
  left: 15px;
  z-index: 1000;
  max-height: calc(100% - 75px);
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  padding: ${dimensions.coreSpacing}px;
  border-radius: 10px;
  background: ${colors.bgLight};
  box-shadow: 0 5px 15px 1px rgba(0, 0, 0, 0.15);
  max-height: 100%;
  overflow: auto;
  position: relative;
  bottom: 0;
  flex-direction: column;
  margin-top: 10px;
`;

const SeeAll = styled.a`
  display: block;
  text-align: center;

  &:hover {
    cursor: pointer;
  }
`;

export {
  Bot,
  Greeting,
  ContentWrapper,
  Title,
  NavButton,
  Content,
  SeeAll,
  Container
};
