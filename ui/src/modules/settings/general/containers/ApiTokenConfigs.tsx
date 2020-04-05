import gql from 'graphql-tag';
import * as compose from 'lodash.flowright';
import Spinner from 'modules/common/components/Spinner';
import { Alert, withProps } from 'modules/common/utils';
import React from 'react';
import { graphql } from 'react-apollo';
import ApiTokenConfig from '../components/ApiTokenConfigs';
import { mutations, queries } from '../graphql';

type FinalProps = {
  fetchApiQuery;
  generateConfigToken: (
    params: { variables: { key: string } }
  ) => Promise<void>;
};

class ConfigContainer extends React.Component<FinalProps> {
  render() {
    const { generateConfigToken, fetchApiQuery } = this.props;

    if (fetchApiQuery.loading) {
      return <Spinner objective={true} />;
    }

    // create or update action
    const generate = (token: string) => {
      generateConfigToken({
        variables: { key: token }
      })
        .then(() => {
          fetchApiQuery.refetch();

          Alert.success('You successfully updated general settings');
        })
        .catch(error => {
          Alert.error(error.message);
        });
    };

    const configs = fetchApiQuery.configs || [];

    const apiKeyConfig = configs.filter(item => item.code === 'API_KEY') || [];
    const apiKey = apiKeyConfig.length > 0 ? apiKeyConfig[0].value : '';

    const apiTokensConfig =
      configs.filter(item => item.code === 'API_TOKENS') || [];
    const apiTokens =
      apiTokensConfig.length > 0 ? apiTokensConfig[0].value : {};

    return (
      <ApiTokenConfig
        {...this.props}
        apiKey={apiKey}
        apiTokens={apiTokens}
        generate={generate}
      />
    );
  }
}

export default withProps<{}>(
  compose(
    graphql<{}>(gql(queries.configs), {
      name: 'fetchApiQuery',
      options: () => ({
        variables: {
          path: '/configs',
          params: {}
        }
      })
    }),
    graphql<{}>(gql(mutations.generateTokenConfig), {
      name: 'generateConfigToken'
    })
  )(ConfigContainer)
);
