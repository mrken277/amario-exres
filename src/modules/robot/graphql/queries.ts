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

export default {
  entries,
  settingsCompleteness
};
