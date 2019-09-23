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
      feature {
        name
        text
        description
        videoUrl
        actions {
          name
          url
        }
      }
      isComplete
    }
  }
`;

export default {
  entries,
  onboardingGetAvailableFeatures,
  actionsCompleteness
};
