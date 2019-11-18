import gql from 'graphql-tag';
import { withProps } from 'modules/common/utils';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import Assistant from '../../components/assistant/Assistant';
import { queries } from '../../graphql';
import { RobotConsumer } from '../RobotContext';

type Props = {
  currentUser: string;
};

type FinalProps = { jobTypesQuery } & Props;

function AssistantContainer(props: FinalProps) {
  const jobTypes = props.jobTypesQuery.robotGetJobTypes || [];

  return (
    <RobotConsumer>
      {({ activeRoute, changeRoute, selectedJobType }) => (
        <Assistant
          {...props}
          jobTypes={jobTypes}
          selectedJobType={selectedJobType}
          currentRoute={activeRoute}
          changeRoute={changeRoute}
        />
      )}
    </RobotConsumer>
  );
}

export default withProps<Props>(
  compose(
    graphql<Props>(gql(queries.getJobTypes), {
      name: 'jobTypesQuery'
    })
  )(AssistantContainer)
);
