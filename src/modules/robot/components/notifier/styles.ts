import { colors, dimensions } from 'modules/common/styles';
import styled from 'styled-components';
import styledTS from 'styled-components-ts';

const Close = styled.div`
  position: absolute;
  right: 10px;
  top: 5px;
  font-size: 16px;
  transition: transform 0.2s ease;

  &:hover {
    cursor: pointer;
    transform: scale(1.1);
  }
`;

const Item = styledTS<{ background?: string }>(styled.div)`
  padding: ${dimensions.coreSpacing}px;
  border-radius: 10px;
  color: ${colors.colorWhite};
  background: ${props => props.background || colors.colorCoreBlue};
  width: 345px;
  box-shadow: 0 0 15px 2px rgba(0, 0, 0, 0.1);
  margin-top: 10px;
  position: relative;
  display: flex;

  > span {
    margin-right: 10px;
  }

  a {
    color: ${colors.colorWhite};
    text-decoration: underline;
  }

  h3 {
    margin-top: 0;
    font-size: 14px;
  }

  p {
    margin: 0;

    a {
      margin-right: 5px;
      font-weight: 500;
    }
  }
`;

export { Item, Close };
