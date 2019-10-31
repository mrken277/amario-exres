const entries = `
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

const customerDetail = `
  query customerDetail($_id: String!) {
    customerDetail(_id: $_id) {
      _id
      firstName
      lastName
      primaryEmail
      primaryPhone
    }
  }
`;

const companyDetail = `
  query companyDetail($_id: String!) {
    companyDetail(_id: $_id) {
      _id
      primaryName
      primaryEmail
      primaryPhone
      description
    }
  }
`;

const channelDetail = `
  query channelDetail($_id: String!) {
    channelDetail(_id: $_id) {
      _id
      name
    }
  }
`;

export default {
  entries,
  getAvailableFeatures,
  stepsCompleteness,
  customerDetail,
  companyDetail,
  channelDetail
};
