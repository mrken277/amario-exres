import gql from 'graphql-tag';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import { withProps } from '../../common/utils';
import Onboarding from '../components/Onboarding';
import { queries } from '../graphql';

type Props = {
  onboardingGetAvailableFeaturesQuery: any;
};

const OnboardingContainer = (props: Props) => {
  const { onboardingGetAvailableFeaturesQuery } = props;

  return (
    <Onboarding
      availableFeatures={
        onboardingGetAvailableFeaturesQuery.robotOnboardingGetAvailableFeatures ||
        []
      }
    />
  );
};

export default withProps<{}>(
  compose(
    graphql<{}, any>(gql(queries.onboardingGetAvailableFeatures), {
      name: 'onboardingGetAvailableFeaturesQuery'
    })
  )(OnboardingContainer)
);
