const entries = `
  query robotEntries {
    robotEntries {
      action
      data
    }
  }
`;

const stepsCompleteness = `
  query onboardingStepsCompleteness($steps: [String]) {
    onboardingStepsCompleteness(steps: $steps)
  }
`;

const onboardingGetAvailableFeatures = `
  query onboardingGetAvailableFeatures {
    onboardingGetAvailableFeatures {
      name
      settings
      showSettings
      isComplete
    }
  }
`;

export default {
  entries,
  onboardingGetAvailableFeatures,
  stepsCompleteness
};
