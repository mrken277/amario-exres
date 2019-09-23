import gql from 'graphql-tag';
import withCurrentUser from 'modules/auth/containers/withCurrentUser';
import { IUser } from 'modules/auth/types';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import { withProps } from '../../common/utils';
import Onboarding from '../components/Onboarding';
import { queries, subscriptions } from '../graphql';

type Props = {};

type FinalProps = Props & {
  onboardingGetAvailableFeaturesQuery: any;
  currentUser: IUser;
};

class OnboardingContainer extends React.Component<
  FinalProps,
  { currentStep?: string }
> {
  constructor(props: FinalProps) {
    super(props);

    this.state = { currentStep: undefined };
  }

  changeStep = (step: string) => {
    this.setState({ currentStep: step });
  };

  componentWillMount() {
    const { onboardingGetAvailableFeaturesQuery, currentUser } = this.props;

    onboardingGetAvailableFeaturesQuery.subscribeToMore({
      document: gql(subscriptions.onboardingChanged),
      variables: { userId: currentUser._id },
      updateQuery: (prev, { subscriptionData: { data } }) => {
        const { onboardingChanged } = data;

        if (onboardingChanged) {
          const { action } = onboardingChanged;

          if (!this.state.currentStep) {
            this.setState({ currentStep: action });
          }
        }
      }
    });
  }

  render() {
    const { currentStep } = this.state;
    const { onboardingGetAvailableFeaturesQuery } = this.props;

    return (
      <Onboarding
        currentStep={currentStep}
        changeStep={this.changeStep}
        availableFeatures={
          onboardingGetAvailableFeaturesQuery.robotOnboardingGetAvailableFeatures ||
          []
        }
      />
    );
  }
}

export default withProps<Props>(
  compose(
    graphql<{}, any>(gql(queries.onboardingGetAvailableFeatures), {
      name: 'onboardingGetAvailableFeaturesQuery'
    })
  )(withCurrentUser(OnboardingContainer))
);
