import gql from 'graphql-tag';
import { withProps } from 'modules/common/utils';
import JobTypeDetail from 'modules/robot/components/assistant/JobTypeDetail';
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
    const jobs = this.props.jobsQuery.robotGetJobs || [];

    return (
      <RobotConsumer>
        {({ changeRoute }) => {
          return <JobTypeDetail jobs={jobs} changeRoute={changeRoute} />;
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
