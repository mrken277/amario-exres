import gql from 'graphql-tag';
import { IUser } from 'modules/auth/types';
import { IItem, IOptions } from 'modules/boards/types';
import Spinner from 'modules/common/components/Spinner';
import { withProps } from 'modules/common/utils';
import { TaskTypeQueryResponse } from 'modules/settings/taskType/types';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import TaskAddForm from '../components/TaskAddForm';
import TaskEditForm from '../components/TaskEditForm';
import { queries } from '../graphql';
import { ITask, ITaskParams } from '../types';

type IProps = {
  options: IOptions;
  item: ITask;
  users: IUser[];
  customerIds?: string[];
  companyIds?: string[];
  contentType?: string;
  contentId?: string;

  addItem: (doc: ITaskParams, callback: () => void, msg?: string) => void;
  removeItem: (itemId: string, callback: () => void) => void;
  saveItem: (doc: ITaskParams, callback: (item: IItem) => void) => void;
  showSelect?: boolean;
  closeModal: () => void;
  callback?: (item?: IItem) => void;
};

type FinalProps = {
  taskTypesQuery: TaskTypeQueryResponse;
} & IProps;

class TaskFormContainer extends React.Component<FinalProps> {
  render() {
    const { taskTypesQuery, addItem } = this.props;

    if (taskTypesQuery.loading) {
      return <Spinner objective={true} />;
    }

    const extendedProps = {
      ...this.props,
      types: taskTypesQuery.taskTypes || []
    };

    if (addItem) {
      return <TaskEditForm {...extendedProps} />;
    }

    return <TaskAddForm {...extendedProps} />;
  }
}

export default withProps<IProps>(
  compose(
    graphql<{}, TaskTypeQueryResponse>(gql(queries.taskTypes), {
      name: 'taskTypesQuery'
    })
  )(TaskFormContainer)
);
