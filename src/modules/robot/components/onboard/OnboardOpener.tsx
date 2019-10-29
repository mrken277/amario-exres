import Button from 'modules/common/components/Button';
import { __ } from 'modules/common/utils';
import * as React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 280px;
  display: flex;
  margin: 0;

  > span {
    margin-right: 10px;
  }

  h3 {
    margin-top: 0;
    font-size: 14px;
    margin-right: 30px;
  }

  p {
    margin-bottom: 10px;
  }
`;

type Props = {
  buttonText: string;
  onClick: () => void;
  currentUser: string;
  forceComplete: () => void;
};

class OnboardOpener extends React.PureComponent<Props> {
  render() {
    const { onClick, buttonText, currentUser, forceComplete } = this.props;

    let message = "You haven't configured yet. Would you like to configure";

    if (buttonText === 'Resume') {
      message = "You haven't fully configured. Would you like to configure";
    }

    return (
      <Wrapper>
        <span role="img" aria-label="Wave">
          👋
        </span>
        <div>
          <h3>
            {__('Hello')}, <b>{currentUser}</b>
          </h3>
          <p>{__(message)}</p>
          <Button btnStyle="success" size="small" onClick={onClick}>
            {__(buttonText)}
          </Button>
          <Button btnStyle="link" size="small" onClick={forceComplete}>
            {__('Never see again')}
          </Button>
        </div>
      </Wrapper>
    );
  }
}

export default OnboardOpener;
