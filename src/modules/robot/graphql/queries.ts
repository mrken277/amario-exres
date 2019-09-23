const entries = `
  query robotEntries {
    robotEntries {
      action
      data
    }
  }
`;

const actionsCompleteness = `
  query onboardingActionsCompleteness($actions: [String]) {
    onboardingActionsCompleteness(actions: $actions)
  }
`;

const onboardingGetAvailableFeatures = `
  query onboardingGetAvailableFeatures {
    onboardingGetAvailableFeatures {
      name
      text
    }
  }
`;

export default {
  entries,
  onboardingGetAvailableFeatures,
  actionsCompleteness
};
