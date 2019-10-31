const forceComplete = `
  mutation {
    onboardingForceComplete
  }
`;

const completeShowStep = `
  mutation onboardingCompleteShowStep($step: String) {
    onboardingCompleteShowStep(step: $step)
  }
`;

const checkStatus = `
  mutation onboardingCheckStatus {
    onboardingCheckStatus
  }
`;

const markAsNotified = `
  mutation robotEntriesMarkAsNotified($_id: String) {
    robotEntriesMarkAsNotified(_id: $_id) {
      data
    }
  }
`;

export default { checkStatus, completeShowStep, forceComplete, markAsNotified };
