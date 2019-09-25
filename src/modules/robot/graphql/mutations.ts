const onboardingForceComplete = `
  mutation {
    onboardingForceComplete
  }
`;

const checkStatus = `
  mutation onboardingCheckStatus {
    onboardingCheckStatus
  }
`;

export default { checkStatus, onboardingForceComplete };
