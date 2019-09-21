import gql from 'graphql-tag';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import { withProps } from '../../common/utils';
import { FEATURE_DETAILS } from '../components/constants';
import FeatureDetail from '../components/FeatureDetail';
import { queries } from '../graphql';
import { IFeature } from '../types';

type Props = {
  feature: IFeature;
  onClick: (feature: IFeature) => void;
};

type FinalProps = Props & {
  settingsCompletenessQuery: any;
};

const FeatureDetailContainer = (props: FinalProps) => {
  const { settingsCompletenessQuery } = props;

  const updatedProps = {
    ...props,
    settingsCompleteness:
      settingsCompletenessQuery.robotSettingsCompleteness || {}
  };

  return <FeatureDetail {...updatedProps} />;
};

export default withProps<Props>(
  compose(
    graphql<Props>(gql(queries.settingsCompleteness), {
      name: 'settingsCompletenessQuery',
      options: ({ feature }) => {
        const detail = FEATURE_DETAILS[feature.name];

        return {
          variables: {
            settingNames: detail.settings.map(setting => setting.name)
          }
        };
      }
    })
  )(FeatureDetailContainer)
);
