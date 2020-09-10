import Wrapper from 'modules/layout/components/Wrapper';

import { getEnv } from 'apolloClient';
import { PageHeader } from 'modules/boards/styles/header';
import Button from 'modules/common/components/Button';
import { __ } from 'modules/common/utils';
import React from 'react';
import { Link } from 'react-router-dom';
import { RightActions, Title } from '../styles';
import SideBar from './SideBar';

const { REACT_APP_DASHBOARD_URL } = getEnv();

type Props = {
  dashboardId: string;
  queryParams: any;
};

class InitialData extends React.Component<Props> {
  renderContent = () => {
    const { dashboardId, queryParams } = this.props;
    const { type } = queryParams;

    const leftActionBar = <Title>Reports library</Title>;

    const rightActionBar = (
      <RightActions>
        <Link to={`/dashboard/explore/${dashboardId}`}>
          <Button uppercase={false} btnStyle="primary" icon="plus-circle">
            Create custom charts
          </Button>
        </Link>
      </RightActions>
    );

    return (
      <>
        <PageHeader>
          {leftActionBar}
          {rightActionBar}
        </PageHeader>
        <iframe
          title="dashboard"
          width="100%"
          height="100%"
          src={`${REACT_APP_DASHBOARD_URL}/reports/?dashboardId=${dashboardId}&type=${type}`}
          frameBorder="0"
          allowFullScreen={true}
        />
      </>
    );
  };

  render() {
    return (
      <Wrapper
        header={
          <Wrapper.Header
            title={`${'Dashboard' || ''}`}
            breadcrumb={[{ title: __('Dashboard'), link: '/dashboard' }]}
          />
        }
        leftSidebar={<SideBar dashboardId={this.props.dashboardId} />}
        content={this.renderContent()}
      />
    );
  }
}

export default InitialData;
