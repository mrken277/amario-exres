import { getEnv } from 'apolloClient';
import Icon from 'modules/common/components/Icon';
import { __ } from 'modules/common/utils';
import { IRobotJob, IRobotJobDetails } from 'modules/robot/types';
import * as React from 'react';
import xss from 'xss';
import { ContentWrapper, Job, NavButton, Title } from '../styles';

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
    const { REACT_APP_API_URL } = getEnv();

    return (
      <ContentWrapper>
        <NavButton onClick={this.back}>
          <Icon icon="arrow-left" size={24} />
        </NavButton>

        <Title>{__(details.title)}</Title>
        <p>{__(details.description)}</p>
        <br />

        {this.props.jobs.map(job => {
          return (
            <Job key={job._id} isNotified={job.isNotified}>
              <div dangerouslySetInnerHTML={{ __html: xss(job.content) }} />

              <a
                target="__blank"
                href={`${REACT_APP_API_URL}/robot-jobDetails?_id=${job._id}`}
              >
                View details
              </a>
            </Job>
          );
        })}
      </ContentWrapper>
    );
  }
}

export default JobTypeDetail;
