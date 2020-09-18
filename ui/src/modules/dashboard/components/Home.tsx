import { __ } from 'modules/common/utils';
import Wrapper from 'modules/layout/components/Wrapper';
import React from 'react';
import DashboardList from '../containers/DashboardList';

type Props = {
  queryParams: any;
};

const Home = (props: Props) => {
  const renderContent = () => {
    return <DashboardList queryParams={props.queryParams} />;
  };

  return (
    <Wrapper
      header={
        <Wrapper.Header
          title={`${'Dashboard' || ''}`}
          breadcrumb={[{ title: __('Dashboard'), link: '/dashboard' }]}
        />
      }
      content={renderContent()}
    />
  );
}

export default Home;
