import Icon from 'modules/common/components/Icon';
import { __ } from 'modules/common/utils';
import { IRobotJob, IRobotJobDetails } from 'modules/robot/types';
import * as React from 'react';
import xss from 'xss';
import { ContentWrapper, NavButton, Title } from '../styles';

type Props = {
  changeRoute: (route: string) => void;
  jobs: IRobotJob[];
  details: IRobotJobDetails;
};

class JobTypeDetail extends React.Component<Props> {
  back = () => {
    this.props.changeRoute('assistant');
  };

  render() {
    const { details } = this.props;

    return (
      <ContentWrapper>
        <NavButton onClick={this.back}>
          <Icon icon="arrow-left" size={24} />
        </NavButton>

        <Title>{__(details.title)}</Title>
        <p>{__(details.description)}</p>

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
