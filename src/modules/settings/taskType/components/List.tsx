import Button from 'modules/common/components/Button';
import DataWithLoader from 'modules/common/components/DataWithLoader';
import HeaderDescription from 'modules/common/components/HeaderDescription';
import ModalTrigger from 'modules/common/components/ModalTrigger';
import Pagination from 'modules/common/components/pagination/Pagination';
import Table from 'modules/common/components/table';
import { IButtonMutateProps } from 'modules/common/types';
import { __ } from 'modules/common/utils';
import Wrapper from 'modules/layout/components/Wrapper';
import React from 'react';
import { ITaskType } from '../types';
import Form from './Form';
import Row from './Row';

type Props = {
  taskTypes: ITaskType[];
  remove: (productId: string) => void;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  loading: boolean;
};

class List extends React.Component<Props> {
  renderRow = () => {
    const { taskTypes, remove, renderButton } = this.props;

    return taskTypes.map(taskType => (
      <Row
        key={taskType._id}
        taskType={taskType}
        remove={remove}
        renderButton={renderButton}
      />
    ));
  };

  render() {
    const { loading, renderButton } = this.props;

    const breadcrumb = [
      { title: __('Settings'), link: '/settings' },
      { title: __('Task Type') }
    ];

    const trigger = (
      <Button btnStyle="success" size="small" icon="add">
        Add Task type
      </Button>
    );

    const modalContent = props => (
      <Form {...props} renderButton={renderButton} />
    );

    const actionBarRight = (
      <ModalTrigger
        title="Add Task Type"
        trigger={trigger}
        content={modalContent}
      />
    );

    const content = (
      <Table>
        <thead>
          <tr>
            <th style={{ width: '70px' }}>{__('Icon')}</th>
            <th>{__('Name')}</th>
            <th />
          </tr>
        </thead>
        <tbody>{this.renderRow()}</tbody>
      </Table>
    );

    return (
      <Wrapper
        header={
          <Wrapper.Header title={__('Task Types')} breadcrumb={breadcrumb} />
        }
        actionBar={
          <Wrapper.ActionBar
            left={
              <HeaderDescription
                icon="/images/actions/30.svg"
                title={'Task Types'}
                description={`All information and know-how related to your business's products and services are found here. Create and add in unlimited products and servicess so that you and your team members can edit and share.`}
              />
            }
            right={actionBarRight}
          />
        }
        footer={<Pagination count={10} />}
        center={true}
        content={
          <DataWithLoader
            data={content}
            loading={loading}
            count={10}
            emptyText="There is no data"
            emptyImage="/images/actions/5.svg"
          />
        }
      />
    );
  }
}

export default List;
