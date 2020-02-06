import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Task from 'modules/activityLogs/components/items/boardItems/Task';
import ErrorMsg from 'modules/common/components/ErrorMsg';
import Spinner from 'modules/common/components/Spinner';
import { Alert, confirm } from 'modules/common/utils';
import checkError from 'modules/common/utils/checkError';
import { mutations, queries } from 'modules/tasks/graphql';
import {
  EditMutationResponse,
  RemoveMutationResponse,
  TaskDetailQueryResponse
} from 'modules/tasks/types';
import React from 'react';

type Props = {
  taskId: string;
};

function FormContainer(props: Props) {
  const { taskId } = props;
  const {
    data: taskDetailsQueryData,
    error: taskDetailsQueryError,
    loading: taskDetailsQueryLoading
  } = useQuery<TaskDetailQueryResponse>(
    gql(queries.taskDetail), {
    variables: {
      _id: taskId
    }
  });

  const [
    editMutation,
    { data: editMutationData,
      error: editMutationError }
  ] = useMutation<EditMutationResponse>(
    gql(mutations.tasksEdit)
  );

  const [
    removeMutation,
    { data: removeMutationData,
      error: removeMutationError }
  ] = useMutation<RemoveMutationResponse>(
    gql(mutations.tasksRemove), {
    refetchQueries: ['activityLogs']
  });

  if (taskDetailsQueryLoading) {
    return <Spinner objective={true} />;
  }

  if (taskDetailsQueryError) {
    const error = checkError([taskDetailsQueryError]);
    return <ErrorMsg>{error.message}</ErrorMsg>;
  };

  const task = taskDetailsQueryData && taskDetailsQueryData.taskDetail;

  if (!task) {
    return <strong>You do not have permission to view this task</strong>;
  }

  const save = (variables, callback) => {
    editMutation({ variables })
    if (editMutationData) {
      Alert.success('You successfully updated a task.');

      if (callback) {
        callback();
      }
    }

    if (editMutationError) {
      Alert.error(editMutationError.message);
    }
  };

  const remove = () => {
    confirm().then(() => {
      removeMutation({
        variables: { _id: taskId }
      })

      if (removeMutationData) {
        Alert.success('You successfully deleted a task.');
      }

      if (removeMutationError) {
        Alert.error(removeMutationError.message);
      }
    });
  }
  const updatedProps = {
    ...props,
    task,
    save,
    remove
  };

  return <Task {...updatedProps} />;
}
export default FormContainer;