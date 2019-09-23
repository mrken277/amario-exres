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
};

type FinalProps = Props & {
  actionsCompletenessQuery: any;
};

const FeatureDetailContainer = (props: FinalProps) => {
  const { actionsCompletenessQuery } = props;

  const updatedProps = {
    ...props,
    actionsCompleteness:
      actionsCompletenessQuery.onboardingActionsCompleteness || {}
  };

  return <FeatureDetail {...updatedProps} />;
};

export default withProps<Props>(
  compose(
    graphql<Props>(gql(queries.actionsCompleteness), {
      name: 'actionsCompletenessQuery',
      options: ({ feature }) => {
        const detail = FEATURE_DETAILS[feature.name];

        return {
          variables: {
            actions: detail.actions.map(action => action.name)
          }
        };
      }
    })
  )(FeatureDetailContainer)
);
