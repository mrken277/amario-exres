import { colors, dimensions } from 'modules/common/styles';
import styled from 'styled-components';

const ModulRow = styled.div`
  display: flex;

  &:last-child {
    margin: 0;
  }
`;

const Greeting = styled.div`
  margin-bottom: 20px;
  font-size: 15px;
`;

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

const Title = styled.h2`
  margin: 0 0 20px;
  font-size: 16px;
  text-transform: capitalize;
`;

const Back = styled.div`
  margin-bottom: 10px;
  border-radius: 20px;
  display: inline-block;
  text-align: center;
  width: 28px;
  height: 28px;
  margin-left: -7px;

  &:hover {
    background: ${colors.bgActive};
    cursor: pointer;
  }

  i {
    line-height: 26px;
  }
`;

const Content = styled.div`
  position: fixed;
  padding: ${dimensions.coreSpacing}px;
  border-radius: 10px;
  background: ${colors.bgLight};
  min-width: 300px;
  max-width: 500px;
  box-shadow: 0 5px 15px 1px rgba(0, 0, 0, 0.15);
  bottom: 65px;
  left: 15px;
  max-height: calc(100% - 75px);
  overflow: auto;
  flex-direction: column;
`;

export { Bot, ModulRow, Greeting, Title, Back, Content };
