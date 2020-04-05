const updateConfigs = `
  mutation configsUpdate($configsMap: JSON!) {
    configsUpdate(configsMap: $configsMap)
  }
`;

const generateTokenConfig = `
  mutation generateTokenConfig($key: String) {
    generateTokenConfig(key: $key)
  }
`;

export default { updateConfigs, generateTokenConfig };
