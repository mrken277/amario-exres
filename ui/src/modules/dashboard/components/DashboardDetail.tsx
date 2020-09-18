import { getEnv } from 'apolloClient';
import { BoardContainer, BoardContent } from 'modules/boards/styles/common';
import { PageHeader } from 'modules/boards/styles/header';
import Button from 'modules/common/components/Button';
import Icon from 'modules/common/components/Icon';
import { __, confirm } from 'modules/common/utils';
import Header from 'modules/layout/components/Header';
import React from 'react';
import { Link } from 'react-router-dom';
import DashbaordForm from '../containers/DashboardForm';
import { RightActions, Title } from '../styles';
import { IDashboard } from '../types';

const { REACT_APP_DASHBOARD_URL } = getEnv();

type Props = {
  id: string;
  dashboard: IDashboard;
  removeDashboard: () => void;
};
type State = {
  show: boolean;
};

class DashboardDetail extends React.Component<Props, State> {
  remove = () => {
    const { removeDashboard } = this.props;

    confirm().then(() => {
      removeDashboard();
    });
  };

  render() {
    const { id, dashboard } = this.props;

    const trigger = (
      <Title>
        {dashboard.name}
        <Icon icon="pen-1" />
      </Title>
    );

    const renderAddForm = () => {
      return (
        <DashbaordForm
          dashboard={dashboard}
          trigger={trigger}
        />
      );
    };

    const rightActionBar = (
      <RightActions>
        <Button
          onClick={this.remove}
          btnStyle="simple"
          uppercase={false}
          icon="times-circle"
        >
          Remove
        </Button>
        <Link to={`/dashboard/reports/${id}`}>
          <Button uppercase={false} btnStyle="primary" icon="plus-circle">
            Add chart
          </Button>
        </Link>
      </RightActions>
    );

    return (
      <BoardContainer>
        <Header
          title={`${'Dashboard' || ''}`}
          breadcrumb={[{ title: __('Dashboard'), link: '/dashboard' }]}
        />

        <BoardContent transparent={true} bgColor="transparent">
          <PageHeader>
            {renderAddForm()}
            {rightActionBar}
          </PageHeader>
          <iframe
            title="dashboard"
            width="100%"
            height="100%"
            src={`${REACT_APP_DASHBOARD_URL}/details/${id}`}
            frameBorder="0"
            allowFullScreen={true}
          />
        </BoardContent>
      </BoardContainer>
    );
  }
}

export default DashboardDetail;
