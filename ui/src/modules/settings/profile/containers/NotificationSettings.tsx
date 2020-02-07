import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { queries as authQueries } from 'modules/auth/graphql';
import { IUser } from 'modules/auth/types';
import Spinner from 'modules/common/components/Spinner';
import { Alert } from 'modules/common/utils';
import React from 'react';
import {
  GetNotificationByEmailMutationResponse,
  GetNotificationByEmailMutationVariables,
  NotificationConfigsQueryResponse,
  NotificationModulesQueryResponse,
  SaveNotificationConfigMutationResponse,
  SaveNotificationConfigMutationVariables
} from '../../../notifications/types';
import NotificationSettings from '../components/NotificationSettings';
import { mutations, queries } from '../graphql';

type Props = {
  currentUser: IUser;
};

const NotificationSettingsContainer = (props: Props) => {
  const { currentUser } = props;

  const {
    loading: notificationsModulesQueryLoading,
    error: notificationsModulesQueryError,
    data: notificationsModulesQueryData
  } = useQuery<NotificationModulesQueryResponse>(gql(queries.notificationsModules));

  const {
    loading: getConfigurationsQueryLoading,
    error: getConfigurationsQueryError,
    data: getConfigurationsQueryData,
    refetch: notificationConfigurationsQueryRefetch
  } = useQuery<NotificationConfigsQueryResponse>(gql(queries.notificationsGetConfigurations));

  const [configGetNotificationByEmailMutation, { error: configGetNotificationByEmailMutationError }] =
    useMutation<GetNotificationByEmailMutationResponse, GetNotificationByEmailMutationVariables>(
      gql(mutations.usersConfigGetNotificationByEmail), {
      refetchQueries: [
        {
          query: gql(authQueries.currentUser)
        }
      ]
    });

  const [saveNotificationConfigurationsMutation, { error: notificationsSaveConfigMutationError }] =
    useMutation<SaveNotificationConfigMutationResponse, SaveNotificationConfigMutationVariables>(
      gql(mutations.notificationsSaveConfig));

  if (notificationsModulesQueryError || getConfigurationsQueryError || configGetNotificationByEmailMutationError || notificationsSaveConfigMutationError) {
    return <p>Error!</p>;
  }

  if (notificationsModulesQueryLoading || getConfigurationsQueryLoading) {
    return <Spinner objective={true} />;
  }

  // save get notification by email
  const configGetNotificationByEmail = variables => {
    configGetNotificationByEmailMutation({ variables })
      .then(() => {
        Alert.success('You successfully changed a notification settings');
      })
      .catch(error => {
        Alert.success(error.message);
      });
  };

  // save notification configurations
  const saveNotificationConfigurations = variables => {
    saveNotificationConfigurationsMutation({ variables })
      .then(() => {
        Alert.success('You successfully changed a notification settings');
        notificationConfigurationsQueryRefetch();
      })
      .catch(error => {
        Alert.success(error.message);
      });
  };

  const configs =
    getConfigurationsQueryData ? getConfigurationsQueryData.notificationsGetConfigurations : [];

  // default value is checked
  let getNotificationByEmail = currentUser.getNotificationByEmail;

  if (getNotificationByEmail === undefined || getNotificationByEmail === null) {
    getNotificationByEmail = false;
  }

  const updatedProps = {
    ...props,
    modules: notificationsModulesQueryData ? notificationsModulesQueryData.notificationsModules : [],
    configs,
    saveNotificationConfigurations,

    getNotificationByEmail,
    configGetNotificationByEmail
  };

  return <NotificationSettings {...updatedProps} />;
};

export default NotificationSettingsContainer;
