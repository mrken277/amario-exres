import Icon from 'modules/common/components/Icon';
import * as React from 'react';
import { ContentWrapper, NavButton } from '../styles';

type Props = {
  changeRoute: (route: string) => void;
};

class JobDetail extends React.Component<Props> {
  back = () => {
    this.props.changeRoute('assistant');
  };

  render() {
    return (
      <ContentWrapper>
        <NavButton onClick={this.back}>
          <Icon icon="arrow-left" size={24} />
        </NavButton>
        Job
      </ContentWrapper>
    );
  }
}

export default JobDetail;
