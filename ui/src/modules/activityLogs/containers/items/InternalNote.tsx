import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import InternalNote from 'modules/activityLogs/components/items/InternalNote';
import { IUser } from 'modules/auth/types';
import ErrorMsg from 'modules/common/components/ErrorMsg';
import Spinner from 'modules/common/components/Spinner';
import { Alert, confirm } from 'modules/common/utils';
import checkError from 'modules/common/utils/checkError';
import { mutations, queries } from 'modules/internalNotes/graphql';
import {
  InternalNoteDetailQueryResponse,
  InternalNotesEditMutationResponse,
  InternalNotesRemoveMutationResponse
} from 'modules/internalNotes/types';
import React, { useState } from 'react';

type Props = {
  activity: any;
  noteId: string;
  currenUser: IUser;
};

function InternalNoteContainer(props: Props, state: any) {
  const defaultisLoading = false;
  const isLoading = useState(defaultisLoading);
  const { noteId } = props;

  const {
    data: internalNoteDetailsData,
    error: internalNoteDetailsError,
    loading: internalNoteDetailsLoading
  } = useQuery<InternalNoteDetailQueryResponse>(
    gql(queries.internalNoteDetail), {
    variables: {
      _id: noteId
    }
  }
  );

  const [
    editMutation,
    { data: editMutationData, error: editMutationError }
  ] = useMutation<InternalNotesEditMutationResponse>(
    gql(mutations.internalNotesEdit)
  );

  const [
    internalNotesRemove,
    { data: internalNotesRemoveData, error: internalNotesRemoveError }
  ] = useMutation<InternalNotesRemoveMutationResponse>(
    gql(mutations.internalNotesRemove), {
    refetchQueries: ['activityLogs']
  }
  );

  if (internalNoteDetailsLoading) {
    return <Spinner />;
  };

  if (internalNoteDetailsError) {
    const error = checkError([internalNoteDetailsError]);
    return <ErrorMsg>{error.message}</ErrorMsg>;
  };

  const internalNote = internalNoteDetailsData && internalNoteDetailsData.internalNoteDetail || [];

  const edit = (variables, callback) => {
    // tslint:disable-next-line: react-hooks-nesting
    useState({ isLoading: true });

    editMutation({ variables: { _id: noteId, ...variables } });

    if (editMutationError) {
      Alert.error(editMutationError.message);
      // tslint:disable-next-line: react-hooks-nesting
      useState({ isLoading: defaultisLoading });
    }

    if (editMutationData) {
      Alert.success('You successfully updated a note.');

      if (callback) {
        callback();
      }

      // tslint:disable-next-line: react-hooks-nesting
      useState({ isLoading: defaultisLoading });
    }

  };

  const remove = () => {
    confirm()
    internalNotesRemove({ variables: { _id: noteId } })
    if (internalNotesRemoveError) {
      Alert.error(internalNotesRemoveError.message);
    }

    if (internalNotesRemoveData) {
      Alert.success('You successfully deleted a note.');
    }
  }

  const updatedProps = {
    ...props,
    internalNote,
    edit,
    remove,
    isLoading
  };

  return <InternalNote {...updatedProps} />;
}
export default InternalNoteContainer;
