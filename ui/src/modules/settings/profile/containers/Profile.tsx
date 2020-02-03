import { useMutation } from '@apollo/react-hooks';
import { AppConsumer } from 'appContext';
import gql from 'graphql-tag';
import { Alert } from 'modules/common/utils';
import UserDetailForm from 'modules/settings/team/containers/UserDetailForm';
import { mutations, queries } from 'modules/settings/team/graphql';
import React from 'react';
import { IUser, IUserDoc } from '../../../auth/types';
import EditProfileForm from '../components/EditProfileForm';
import { EditProfileMutationResponse } from '../types';

type Props = {
  queryParams: any;
};

const Profile = (props: Props & { currentUser: IUser }) => {
  const { currentUser, queryParams } = props;

  const [usersEditProfile, { error: usersEditProfileMutationError }] =
    useMutation<EditProfileMutationResponse>(
      gql(mutations.usersEditProfile), {
      refetchQueries: [
        {
          query: gql(queries.userDetail),
          variables: {
            _id: currentUser._id
          }
        }
      ]
    });

  if (usersEditProfileMutationError) {
    return <p>Error!</p>;
  }

  const save = (variables: IUserDoc, callback: () => void) => {
    usersEditProfile({ variables })
      .then(() => {
        Alert.success(`You managed to update your info`);
        callback();
      })
      .catch(error => {
        Alert.error(error.message);
      });
  };

  const editForm = ({ user, closeModal }) => (
    <EditProfileForm currentUser={user} save={save} closeModal={closeModal} />
  );

  return (
    <UserDetailForm
      _id={currentUser._id}
      queryParams={queryParams}
      renderEditForm={editForm}
    />
  );
};

const WithConsumer = (props: Props) => {
  return (
    <AppConsumer>
      {({ currentUser }) => (
        <Profile {...props} currentUser={currentUser || ({} as IUser)} />
      )}
    </AppConsumer>
  );
};

export default WithConsumer;
