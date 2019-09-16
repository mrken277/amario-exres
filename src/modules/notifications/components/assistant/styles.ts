import { colors, dimensions } from 'modules/common/styles';
import styled, { css } from 'styled-components';
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

export { Bot };
