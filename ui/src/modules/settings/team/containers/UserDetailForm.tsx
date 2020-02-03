import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { IUser } from 'modules/auth/types';
import ButtonMutate from 'modules/common/components/ButtonMutate';
import Spinner from 'modules/common/components/Spinner';
import { IButtonMutateProps } from 'modules/common/types';
import React from 'react';
import { queries as channelQueries } from '../../channels/graphql';
import { ChannelsQueryResponse } from '../../channels/types';
import UserDetailForm from '../components/detail/UserDetailForm';
import { mutations, queries } from '../graphql';
import {
  UserConverationsQueryResponse,
  UserDetailQueryResponse
} from '../types';
import UserForm from './UserForm';

type Props = {
  _id: string;
  queryParams: any;
  renderEditForm?: (
    { closeModal, user }: { closeModal: () => void; user: IUser }
  ) => React.ReactNode;
};

const UserDetailFormContainer = (props: Props) => {
  const { renderEditForm, _id, queryParams } = props;

  const {
    loading: userDetailQueryLoading,
    error: userDetailQueryError,
    data: userDetailQueryData,
    refetch: userDetailQueryRefetch
  } = useQuery<UserDetailQueryResponse, { _id: string }>(
    gql(queries.userDetail),
    { variables: { _id } });

  const {
    loading: userConversationsQueryLoading,
    error: userConversationsQueryError,
    data: userConversationsQueryData
  } = useQuery<UserConverationsQueryResponse, { _id: string; perPage: number }>(
    gql(queries.userConversations),
    {
      variables: {
        _id,
        perPage: queryParams.limit ? parseInt(queryParams.limit, 10) : 20
      }
    });

  const {
    loading: channelsQueryLoading,
    error: channelsQueryError,
    data: channelsQueryData
  } = useQuery<ChannelsQueryResponse>(gql(channelQueries.channels),
    { variables: { _id } });

  if (userDetailQueryError || channelsQueryError || userConversationsQueryError) {
    return <p>Error!</p>;
  }

  if (userDetailQueryLoading || userConversationsQueryLoading || channelsQueryLoading) {
    return <Spinner />;
  }

  const { list = [], totalCount = 0 } =
    userConversationsQueryData ? userConversationsQueryData.userConversations : {};

  const renderButton = ({
    name,
    values,
    isSubmitted,
    callback,
    object
  }: IButtonMutateProps) => {
    const afterMutate = () => {
      userDetailQueryRefetch();

      if (callback) {
        callback();
      }
    };

    return (
      <ButtonMutate
        mutation={mutations.usersEdit}
        variables={values}
        callback={afterMutate}
        isSubmitted={isSubmitted}
        type="submit"
        successMessage={`You successfully ${
          object ? 'updated' : 'added'
          } a ${name}`}
      />
    );
  };

  const editForm = localProps => {
    return (
      <UserForm
        {...localProps}
        closeModal={localProps.closeModal}
        object={localProps.user}
        renderButton={renderButton}
      />
    );
  };

  const updatedProps = {
    renderEditForm: renderEditForm ? renderEditForm : editForm,
    user: userDetailQueryData ? userDetailQueryData.userDetail : {} as IUser,
    participatedConversations: list,
    totalConversationCount: totalCount,
    channels: channelsQueryData ? channelsQueryData.channels : []
  };

  return <UserDetailForm {...updatedProps} />;
};

export default UserDetailFormContainer;
