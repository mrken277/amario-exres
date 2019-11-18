const getJobs = `
  query robotGetJobs($type: String, $isNotified: Boolean, $parentId: String) {
    robotGetJobs(type: $type, isNotified: $isNotified, parentId: $parentId) {
      _id
      content
      isNotified
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
  getJobs,
  getAvailableFeatures,
  stepsCompleteness
};
