import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import InternalNote from 'modules/activityLogs/components/items/InternalNote';
import { IUser } from 'modules/auth/types';
import ErrorMsg from 'modules/common/components/ErrorMsg';
import Spinner from 'modules/common/components/Spinner';
import { Alert, confirm } from 'modules/common/utils';
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

type State = {
  loading: boolean;
};

function InternalNoteContainer(props: Props, state: State) {

  const [loading, setLoading] = useState(false);
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
    return <Spinner objective={true} />;
  }

  if (internalNoteDetailsError) {
    return <ErrorMsg>{internalNoteDetailsError.message}</ErrorMsg>;
  }

  if (!internalNoteDetailsData) {
    return null;
  }

  const internalNote = internalNoteDetailsData.internalNoteDetail;

  const edit = (variables, callback) => {
    setLoading(true);
    editMutation({ variables: { _id: noteId, ...variables } });

    if (editMutationError) {
      Alert.error(editMutationError.message);
      setLoading(false);
    }

    if (editMutationData) {
      Alert.success('You successfully updated a note.');

      if (callback) {
        callback();
      }
      setLoading(false);
    }

  };

  const remove = () => {
    confirm().then(() => {
      internalNotesRemove({ variables: { _id: noteId } })
      if (internalNotesRemoveError) {
        Alert.error(internalNotesRemoveError.message);
      }

      if (internalNotesRemoveData) {
        Alert.success('You successfully deleted a note.');
      }
    });
  }

  const updatedProps = {
    ...props,
    internalNote,
    edit,
    remove,
    isLoading: loading
  };

  return <InternalNote {...updatedProps} />;
}
export default InternalNoteContainer;
