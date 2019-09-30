import styled from 'styled-components';

const ModulRow = styled.div`
  display: flex;
  margin-bottom: 15px;

  &:last-child {
    margin: 0;
  }
`;

const Greeting = styled.div`
  margin-bottom: 20px;
  font-size: 15px;
`;

export { ModulRow, Greeting };
