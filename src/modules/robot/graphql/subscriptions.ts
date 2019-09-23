const onboardingChanged = `
  subscription onboardingChanged($userId: String!) {
    onboardingChanged(userId: $userId) {
      action
    }
  }
`;

export default {
  onboardingChanged
};
