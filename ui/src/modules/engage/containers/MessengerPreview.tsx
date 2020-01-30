import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import ErrorMsg from 'modules/common/components/ErrorMsg';
import Spinner from 'modules/common/components/Spinner';
import React from 'react';
import { UserDetailQueryResponse } from '../../settings/team/types';
import MessengerPreview from '../components/MessengerPreview';
import { queries } from '../graphql';

type Props = {
  fromUserId: string;
  sentAs: string;
  content: string;
};

function MessengerPreviewContainer(props: Props) {
  const { fromUserId } = props;

  const {
    loading: userDetailLoading,
    error: userDetailError,
    data: userDetailData
  } = useQuery<UserDetailQueryResponse, { _id: string }>(
    gql(queries.userDetail),
    {
      variables: {
        _id: fromUserId
      }
    }
  );

  if (userDetailLoading) {
    return <Spinner objective={true} />;
  };

  if (userDetailError) {
    return <ErrorMsg>{userDetailError.message}</ErrorMsg>;
  };

  const user = userDetailData && userDetailData.userDetail;
  const updatedProps = {
    ...props,
    user
  };

  return <MessengerPreview {...updatedProps} />;
}

export default MessengerPreviewContainer;