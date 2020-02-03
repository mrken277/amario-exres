import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { IUser } from 'modules/auth/types';
import { Alert } from 'modules/common/utils';
import React from 'react';
import UserResetPasswordForm from '../components/UserResetPasswordForm';
import { mutations } from '../graphql';
import { ResetMemberPasswordResponse } from '../types';

type Props = {
  object: IUser;
  closeModal: () => void;
};

const UserResetPasswordContainer = (props: Props) => {
  const [usersResetMemberPassword, { error: usersResetMemberPasswordError }] =
    useMutation<ResetMemberPasswordResponse>(
      gql(mutations.usersResetMemberPassword),
      { refetchQueries: ['users'] }
    );

  if (usersResetMemberPasswordError) {
    return <p>Error!</p>;
  }

  const save = ({ _id, newPassword, repeatPassword }) => {
    if ((newPassword && !repeatPassword) || repeatPassword === 0) {
      return Alert.error('Please enter a repeat password');
    }

    if (!newPassword || newPassword === 0) {
      return Alert.error('Please enter a new password');
    }

    if (newPassword !== repeatPassword) {
      return Alert.error("Password didn't match");
    }

    usersResetMemberPassword({ variables: { _id, newPassword } })
      .then(() => {
        Alert.success('Your password has been changed and updated');
        props.closeModal();
      })
      .catch(error => {
        Alert.error(error.message);
      });
  };

  const updatedProps = {
    ...props,
    save
  };

  return <UserResetPasswordForm {...updatedProps} />;
};

export default UserResetPasswordContainer;
