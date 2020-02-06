import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Alert } from 'modules/common/utils';
import React from 'react';
import { withRouter } from 'react-router';
import { IRouterProps } from '../../../common/types';
import UserConfirmation from '../components/UserConfirmation';
import { mutations } from '../graphql';
import { ConfirmMutationResponse, ConfirmMutationVariables } from '../types';

type Props = {
  queryParams: any;
};

type FinalProps = Props & IRouterProps;

const UserConfirmationContainer = (props: FinalProps) => {
  const { queryParams, history } = props;

  const [usersConfirmInvitation, { error: usersConfirmInvitationError, }] =
    useMutation<ConfirmMutationResponse, ConfirmMutationVariables>(
      gql(mutations.usersConfirmInvitation),
      { refetchQueries: ['users'] }
    );

  if (usersConfirmInvitationError) {
    return <p>Error!</p>;
  }

  const confirmUser = ({
    password,
    passwordConfirmation,
    username,
    fullName
  }: {
    password: string;
    passwordConfirmation: string;
    username: string;
    fullName: string;
  }) => {
    usersConfirmInvitation({
      variables: {
        token: queryParams.token,
        password,
        passwordConfirmation,
        username,
        fullName
      }
    })
      .then(() => {
        Alert.success('You successfully verified');
        history.push('/');
      })
      .catch(e => {
        Alert.error(e.message);
      });
  };

  const updatedProps = {
    confirmUser
  };

  return <UserConfirmation {...updatedProps} />;
}

export default withRouter<FinalProps>(UserConfirmationContainer);
