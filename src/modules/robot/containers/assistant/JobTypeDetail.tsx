import gql from 'graphql-tag';
import { withProps } from 'modules/common/utils';
import JobTypeDetail from 'modules/robot/components/assistant/JobTypeDetail';
import { JOB_DETAILS } from 'modules/robot/constants';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import { queries } from '../../graphql';
import { RobotConsumer } from '../RobotContext';

type Props = {
  jobType: string;
};

type FinalProps = { jobsQuery } & Props;

class JobTypeDetailContainer extends React.Component<FinalProps> {
  render() {
    const { jobsQuery, jobType } = this.props;
    const jobs = jobsQuery.robotGetJobs || [];

    return (
      <RobotConsumer>
        {({ changeRoute }) => {
          return (
            <JobTypeDetail
              details={JOB_DETAILS[jobType]}
              jobs={jobs}
              changeRoute={changeRoute}
            />
          );
        }}
      </RobotConsumer>
    );
  }
}

export default withProps<Props>(
  compose(
    graphql<Props>(gql(queries.getJobs), {
      options: ({ jobType }) => ({
        variables: { type: jobType, isNotified: false },
        fetchPolicy: 'network-only'
      }),
      name: 'jobsQuery'
    })
  )(JobTypeDetailContainer)
);
