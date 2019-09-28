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

const getAvailableFeatures = `
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
  getAvailableFeatures,
  stepsCompleteness
};
