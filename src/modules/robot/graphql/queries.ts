const entries = `
  query robotEntries {
    robotEntries {
      action
      data
    }
  }
`;

const settingsCompleteness = `
  query robotSettingsCompleteness($settingNames: [String]) {
    robotSettingsCompleteness(settingNames: $settingNames)
  }
`;

const onboardingGetAvailableFeatures = `
  query robotOnboardingGetAvailableFeatures {
    robotOnboardingGetAvailableFeatures {
      name
      text
    }
  }
`;

export default {
  entries,
  onboardingGetAvailableFeatures,
  settingsCompleteness
};
