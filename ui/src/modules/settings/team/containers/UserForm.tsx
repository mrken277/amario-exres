import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Spinner from 'modules/common/components/Spinner';
import { IButtonMutateProps } from 'modules/common/types';
import { ICommonFormProps } from 'modules/settings/common/types';
import { queries as generalQueries } from 'modules/settings/general/graphql';
import {
  IUserGroup,
  UsersGroupsQueryResponse
} from 'modules/settings/permissions/types';
import React from 'react';
import { IUser } from '../../../auth/types';
import { queries as channelQueries } from '../../channels/graphql';
import { ChannelsQueryResponse, IChannel } from '../../channels/types';
import { queries as usersGroupsQueries } from '../../permissions/graphql';
import UserForm from '../components/UserForm';

type Props = {
  renderButton: (props: IButtonMutateProps) => JSX.Element;
};

const UserFormContainer = (props: Props & ICommonFormProps) => {
  const {
    loading: getEnvQueryLoading,
    error: getEnvQueryError,
    data: getEnvQueryData
  } = useQuery(gql(generalQueries.configsGetEnv),
    { fetchPolicy: 'network-only' });

  const {
    loading: channelsQueryLoading,
    error: channelsQueryError,
    data: channelsQueryData
  } = useQuery<ChannelsQueryResponse>(
    gql(channelQueries.channels),
    { fetchPolicy: 'network-only' });

  const {
    loading: usersGroupsQueryLoading,
    error: usersGroupsQueryError,
    data: usersGroupsQueryData
  } = useQuery<UsersGroupsQueryResponse>(
    gql(usersGroupsQueries.usersGroups),
    { fetchPolicy: 'network-only' });

  if (getEnvQueryError || channelsQueryError || usersGroupsQueryError) {
    return <p>Error!</p>;
  }

  if (channelsQueryLoading || usersGroupsQueryLoading || getEnvQueryLoading) {
    return <Spinner />;
  }

  const config = getEnvQueryData ? getEnvQueryData.configsGetEnv : {};
  const object = props.object || ({} as IUser);

  const channels = channelsQueryData ? channelsQueryData.channels : [];
  const groups = usersGroupsQueryData ? usersGroupsQueryData.usersGroups : [];

  let selectedChannels: IChannel[] = [];
  let selectedGroups: IUserGroup[] = [];

  if (object._id) {
    selectedChannels = channels.filter(c =>
      (c.memberIds || []).includes(object._id)
    );
    selectedGroups = groups.filter(g =>
      (object.groupIds || []).includes(g._id)
    );
  }

  const updatedProps = {
    ...props,
    showBrands: config.USE_BRAND_RESTRICTIONS === 'true',
    selectedChannels,
    selectedGroups,
    channels,
    groups
  };

  return <UserForm {...updatedProps} />;
};

export default UserFormContainer;
