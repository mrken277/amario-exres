const jobDetail = `
  query robotEntries($action: String, $isNotified: Boolean, $parentId: String) {
    robotEntries(action: $action, isNotified: $isNotified, parentId: $parentId) {
      _id
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
  jobDetail,
  getAvailableFeatures,
  stepsCompleteness
};
