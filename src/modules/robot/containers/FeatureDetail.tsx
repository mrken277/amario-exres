import gql from 'graphql-tag';
import withCurrentUser from 'modules/auth/containers/withCurrentUser';
import { IUser } from 'modules/auth/types';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import { withProps } from '../../common/utils';
import FeatureDetail from '../components/FeatureDetail';
import { queries, subscriptions } from '../graphql';
import { IFeature } from '../types';

type Props = {
  feature: IFeature;
};

type FinalProps = Props & {
  stepsCompletenessQuery: any;
  currentUser: IUser;
};

class FeatureDetailContainer extends React.Component<FinalProps> {
  componentWillMount() {
    const { stepsCompletenessQuery, currentUser } = this.props;

    stepsCompletenessQuery.subscribeToMore({
      document: gql(subscriptions.onboardingChanged),
      variables: { userId: currentUser._id },
      updateQuery: (prev, { subscriptionData: { data } }) => {
        stepsCompletenessQuery.refetch();
      }
    });
  }

  render() {
    const { stepsCompletenessQuery } = this.props;

    const updatedProps = {
      ...this.props,
      stepsCompleteness:
        stepsCompletenessQuery.onboardingStepsCompleteness || {}
    };

    return <FeatureDetail {...updatedProps} />;
  }
}

export default withProps<Props>(
  compose(
    graphql<Props>(gql(queries.stepsCompleteness), {
      name: 'stepsCompletenessQuery',
      options: ({ feature }) => {
        return {
          variables: {
            steps: feature.settings
          }
        };
      }
    })
  )(withCurrentUser(FeatureDetailContainer))
);
