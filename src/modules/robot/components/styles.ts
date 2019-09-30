import { colors } from 'modules/common/styles';
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

export { Bot, ModulRow, Greeting, Title, Back };
