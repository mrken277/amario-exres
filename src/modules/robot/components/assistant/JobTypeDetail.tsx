import Icon from 'modules/common/components/Icon';
import { IRobotJob } from 'modules/robot/types';
import * as React from 'react';
import xss from 'xss';
import { ContentWrapper, NavButton } from '../styles';

type Props = {
  changeRoute: (route: string) => void;
  jobs: IRobotJob[];
};

class JobTypeDetail extends React.Component<Props> {
  back = () => {
    this.props.changeRoute('assistant');
  };

  render() {
    return (
      <ContentWrapper>
        <NavButton onClick={this.back}>
          <Icon icon="arrow-left" size={24} />
        </NavButton>
        {this.props.jobs.map(job => {
          return (
            <div
              key={job._id}
              dangerouslySetInnerHTML={{ __html: xss(job.content) }}
            />
          );
        })}
      </ContentWrapper>
    );
  }
}

export default JobTypeDetail;
