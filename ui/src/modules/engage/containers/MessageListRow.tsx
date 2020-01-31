import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import ErrorMsg from 'modules/common/components/ErrorMsg';
import Spinner from 'modules/common/components/Spinner';
import { IRouterProps } from 'modules/common/types';
import { Alert, confirm } from 'modules/common/utils';
import checkError from 'modules/common/utils/checkError';
import React from 'react';
import { withRouter } from 'react-router';
import MessageListRow from '../components/MessageListRow';
import { mutations, queries } from '../graphql';
import {
  IEngageMessage,
  MutationVariables,
  RemoveMutationResponse,
  SetLiveManualMutationResponse,
  SetLiveMutationResponse,
  SetPauseMutationResponse
} from '../types';

type Props = {
  isChecked: boolean;
  toggleBulk: (value: IEngageMessage, isChecked: boolean) => void;
  message: IEngageMessage;
  queryParams: any;
};
type FinalProps = {
} & IRouterProps & Props;

function MessageRowContainer(props: FinalProps) {
  const {
    history,
    message,
    isChecked,
    toggleBulk,
    queryParams
  } = props;

  const [removeMutation,
    { loading: removeMutationLoading,
      error: removeMutationError,
      data: removeMutationData
    }] = useMutation<RemoveMutationResponse, MutationVariables>(
      gql(mutations.messageRemove), {
      refetchQueries: [
        'engageMessages',
        'engageMessagesTotalCount',
        'kindCounts',
        'statusCounts'
      ]
    });

  const [setPauseMutation,
    { loading: setPauseLoading,
      error: setPauseError
    }] = useMutation<SetPauseMutationResponse, MutationVariables>(
      gql(mutations.setPause), {
      refetchQueries: [
        {
          query: gql(queries.statusCounts),
          variables: {
            kind: queryParams.kind || ''
          }
        },
        {
          query: gql(queries.engageMessageDetail),
          variables: {
            _id: message._id
          }
        }
      ]
    });

  const [setLiveMutation,
    { loading: setLiveLoading,
      error: setLiveError
    }] = useMutation<SetLiveMutationResponse, MutationVariables>(
      gql(mutations.setLive), {
      refetchQueries: [
        {
          query: gql(queries.statusCounts),
          variables: {
            kind: queryParams.kind || ''
          }
        },
        {
          query: gql(queries.engageMessageDetail),
          variables: {
            _id: message._id
          }
        }
      ]
    });

  const [setLiveManualMutation,
    { loading: setLiveManualLoading,
      error: setLiveManualError
    }] = useMutation<SetLiveManualMutationResponse, MutationVariables>(
      gql(mutations.setLiveManual), {
      refetchQueries: [
        {
          query: gql(queries.statusCounts),
          variables: {
            kind: queryParams.kind || ''
          }
        },
        {
          query: gql(queries.engageMessageDetail),
          variables: {
            _id: message._id
          }
        }
      ]
    });

  if (removeMutationLoading || setPauseLoading || setLiveLoading || setLiveManualLoading) {
    return <Spinner objective={true} />;
  };

  if (setPauseError || setLiveError || setLiveManualError) {
    const error = checkError([setPauseError, setLiveError, setLiveManualError]);

    return <ErrorMsg>{error.message}</ErrorMsg>;
  };

  const doMutation = (mutation, msg: string) =>
    mutation({
      variables: { _id: message._id }
    })
      .then(() => {
        Alert.success(msg);
      })
      .catch(error => {
        Alert.error(error.message);
      });

  const edit = () => {
    history.push(`/engage/messages/edit/${message._id}`);
  };

  const show = () => {
    history.push(`/engage/messages/show/${message._id}`);
  };

  const remove = () => {
    confirm().then(() => {
      doMutation(removeMutation, `You just deleted an engagement message.`)
      if (removeMutationData) {
        history.push('/engage');
      }
      if (removeMutationError) {
        Alert.error(removeMutationError.message);
      };
    });
  };

  const setLiveManual = () =>
    doMutation(setLiveManualMutation, 'Yay! Your engagement message is now live.');
  const setLive = () =>
    doMutation(setLiveMutation, 'Yay! Your engagement message is now live.');
  const setPause = () =>
    doMutation(setPauseMutation, 'Your engagement message is paused for now.');

  const updatedProps = {
    ...props,
    edit,
    show,
    remove,
    setLive,
    setLiveManual,
    setPause,
    isChecked,
    toggleBulk
  };

  return <MessageListRow {...updatedProps} />;
};

export default withRouter<FinalProps>(MessageRowContainer);