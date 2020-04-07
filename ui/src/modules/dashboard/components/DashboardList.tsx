import HeaderDescription from 'modules/common/components/HeaderDescription';
import Icon from 'modules/common/components/Icon';
import ModalTrigger from 'modules/common/components/ModalTrigger';
import { IButtonMutateProps } from 'modules/common/types';
import { __ } from 'modules/common/utils';
import React from 'react';

import List from 'modules/settings/common/components/List';
import { ICommonListProps } from 'modules/settings/common/types';
import { Actions, Template, TemplateBox, Templates } from '../styles';
import DashboardForm from './DashboardForm';

type Props = {
  renderButton: (props: IButtonMutateProps) => JSX.Element;
} & ICommonListProps;

class DashboardList extends React.Component<Props> {
  renderForm = props => {
    return <DashboardForm {...props} renderButton={this.props.renderButton} />;
  };

  removeTemplate = object => {
    this.props.remove(object._id);
  };

  renderEditAction = object => {
    const { save } = this.props;

    const content = props => {
      return this.renderForm({ ...props, object, save });
    };

    return (
      <ModalTrigger
        enforceFocus={false}
        title="Edit"
        size="lg"
        trigger={
          <div>
            <Icon icon="edit" /> Edit
          </div>
        }
        content={content}
      />
    );
  };

  onTrClick = object => {
    const { history } = this.props;

    history.push(`/dashboard/details/${object._id}`);
  };

  renderRow({ objects }) {
    return objects.map((object, index) => (
      <Template key={index} onClick={() => this.onTrClick(object)}>
        <TemplateBox>
          <Actions>
            {this.renderEditAction(object)}
            <div onClick={this.removeTemplate.bind(this, object)}>
              <Icon icon="cancel-1" /> Delete
            </div>
          </Actions>
        </TemplateBox>
        <h5>{object.name}</h5>
      </Template>
    ));
  }

  renderContent = props => {
    return <Templates>{this.renderRow(props)}</Templates>;
  };

  render() {
    return (
      <List
        formTitle="New dashboard"
        size="lg"
        title={__('Dashboard')}
        leftActionBar={
          <HeaderDescription
            icon="/images/actions/22.svg"
            title="Dashboards"
            description={`Dashboard`}
          />
        }
        renderForm={this.renderForm}
        renderContent={this.renderContent}
        {...this.props}
      />
    );
  }
}

export default DashboardList;
