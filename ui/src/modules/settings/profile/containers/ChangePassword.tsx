import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Alert } from 'modules/common/utils';
import React from 'react';
import ChangePassword from '../components/ChangePassword';
import { mutations } from '../graphql';

type Props = {
  closeModal: () => void;
};

const ChangePasswordContainer = (props: Props) => {
  const [changePasswordMutation, { error: changePasswordMutationError }] = useMutation(gql(mutations.usersChangePassword));

  if (changePasswordMutationError) {
    return <p>Error!</p>;
  }

  const save = ({ currentPassword, newPassword, confirmation }) => {
    if (newPassword !== confirmation) {
      return Alert.error("Password didn't match");
    }

    if (!currentPassword || currentPassword === 0) {
      return Alert.error('Please enter a current password');
    }

    if (!newPassword || newPassword === 0) {
      return Alert.error('Please enter a new password');
    }

    changePasswordMutation({ variables: { currentPassword, newPassword } })
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

  return <ChangePassword {...updatedProps} />;
};

export default ChangePasswordContainer;
