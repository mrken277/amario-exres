import gql from 'graphql-tag';
import ButtonMutate from 'modules/common/components/ButtonMutate';
import { IButtonMutateProps } from 'modules/common/types';
import { Alert, confirm, withProps } from 'modules/common/utils';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import List from '../components/List';
import { mutations, queries } from '../graphql';
import { RemoveMutationResponse, TaskTypeQueryResponse } from '../types';

type FinalProps = {
  taskTypesQuery: TaskTypeQueryResponse;
} & RemoveMutationResponse;

class ProductListContainer extends React.Component<FinalProps> {
  render() {
    const { taskTypesQuery, removeMutation } = this.props;

    const taskTypes = taskTypesQuery.taskTypes || [];

    // remove action
    const remove = taskTypeId => {
      confirm().then(() => {
        removeMutation({
          variables: { _id: taskTypeId }
        })
          .then(() => {
            taskTypesQuery.refetch();

            Alert.success(`You successfully deleted a taskt type.`);
          })
          .catch(error => {
            Alert.error(error.message);
          });
      });
    };

    const renderButton = ({
      name,
      values,
      isSubmitted,
      callback,
      object
    }: IButtonMutateProps) => {
      return (
        <ButtonMutate
          mutation={object ? mutations.taskTypesEdit : mutations.taskTypesAdd}
          variables={values}
          callback={callback}
          refetchQueries={[{ query: gql(queries.taskTypes) }]}
          isSubmitted={isSubmitted}
          type="submit"
          successMessage={`You successfully ${
            object ? 'updated' : 'added'
          } a ${name}`}
        />
      );
    };

    const updatedProps = {
      ...this.props,
      taskTypes,
      renderButton,
      remove,
      loading: taskTypesQuery.loading
    };

    return <List {...updatedProps} />;
  }
}

export default withProps<{}>(
  compose(
    graphql<{}, TaskTypeQueryResponse>(gql(queries.taskTypes), {
      name: 'taskTypesQuery'
    }),
    graphql<{}, RemoveMutationResponse, { _id: string }>(
      gql(mutations.taskTypesRemove),
      {
        name: 'removeMutation'
      }
    )
  )(ProductListContainer)
);
