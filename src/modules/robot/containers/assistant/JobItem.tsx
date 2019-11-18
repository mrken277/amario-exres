import gql from 'graphql-tag';
import { withProps } from 'modules/common/utils';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import ActionItem from '../../components/ActionItem';
import { queries } from '../../graphql';
import { RobotConsumer } from '../RobotContext';

type Props = {
  job: string;
  icon?: string;
  color?: string;
  title: string;
  vertical?: boolean;
  description?: string;
  onClick?: () => void;
  isComplete?: boolean;
  disabled?: boolean;
};

type FinalProps = { jobDetailQuery: any } & Props;

class JobDetailContainer extends React.Component<FinalProps> {
  render() {
    const { job } = this.props;

    const updatedProps = {
      ...this.props,
      count: 1
    };

    return (
      <RobotConsumer>
        {({ setCurrentJob, changeRoute }) => {
          const handleClick = () => {
            setCurrentJob(job);
            changeRoute('assistant-jobDetail');
          };

          return <ActionItem {...updatedProps} onClick={handleClick} />;
        }}
      </RobotConsumer>
    );
  }
}

export default withProps<Props>(
  compose(
    graphql<Props>(gql(queries.jobDetail), {
      options: ({ job }) => ({
        variables: { job, isNotified: false },
        fetchPolicy: 'network-only'
      }),
      name: 'jobDetailQuery'
    })
  )(JobDetailContainer)
);
