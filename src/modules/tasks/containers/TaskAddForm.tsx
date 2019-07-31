import gql from 'graphql-tag';
import { IItem, IItemParams, IOptions } from 'modules/boards/types';
import Spinner from 'modules/common/components/Spinner';
import { withProps } from 'modules/common/utils';
import { TaskTypeQueryResponse } from 'modules/settings/taskType/types';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import TaskAddForm from '../components/TaskAddForm';
import { queries } from '../graphql';

type IProps = {
  options: IOptions;
  customerIds?: string[];
  companyIds?: string[];
  dealId?: string;
  ticketId?: string;
  saveItem: (doc: IItemParams, callback: (item: IItem) => void) => void;
  showSelect?: boolean;
  closeModal: () => void;
  callback?: (item?: IItem) => void;
};

type FinalProps = {
  taskTypesQuery: TaskTypeQueryResponse;
} & IProps;

class TaskAddFormContainer extends React.Component<FinalProps> {
  render() {
    const { taskTypesQuery } = this.props;

    if (taskTypesQuery.loading) {
      return <Spinner objective={true} />;
    }

    const extendedProps = {
      ...this.props,
      types: taskTypesQuery.taskTypes || []
    };

    return <TaskAddForm {...extendedProps} />;
  }
}

export default withProps<IProps>(
  compose(
    graphql<{}, TaskTypeQueryResponse>(gql(queries.taskTypes), {
      name: 'taskTypesQuery'
    })
  )(TaskAddFormContainer)
);
