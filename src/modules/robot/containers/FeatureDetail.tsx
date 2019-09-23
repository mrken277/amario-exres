import gql from 'graphql-tag';
import withCurrentUser from 'modules/auth/containers/withCurrentUser';
import { IUser } from 'modules/auth/types';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import { withProps } from '../../common/utils';
import { FEATURE_DETAILS } from '../components/constants';
import FeatureDetail from '../components/FeatureDetail';
import { queries, subscriptions } from '../graphql';
import { IFeature } from '../types';

type Props = {
  feature: IFeature;
};

type FinalProps = Props & {
  actionsCompletenessQuery: any;
  currentUser: IUser;
};

class FeatureDetailContainer extends React.Component<FinalProps> {
  componentWillMount() {
    const { actionsCompletenessQuery, currentUser } = this.props;

    actionsCompletenessQuery.subscribeToMore({
      document: gql(subscriptions.onboardingChanged),
      variables: { userId: currentUser._id },
      updateQuery: (prev, { subscriptionData: { data } }) => {
        actionsCompletenessQuery.refetch();
      }
    });
  }

  render() {
    const { actionsCompletenessQuery } = this.props;

    const updatedProps = {
      ...this.props,
      actionsCompleteness:
        actionsCompletenessQuery.onboardingActionsCompleteness || {}
    };

    return <FeatureDetail {...updatedProps} />;
  }
}

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
  )(withCurrentUser(FeatureDetailContainer))
);
