import React from 'react';

import { Button, Typography } from 'antd';

import { IDashboardItem } from '../types';
import PageHeader from './PageHeader';

type Props = {
  dashboardItems: IDashboardItem[];
  editDashboardItem: (
    doc: {
      _id: string;
      layout: string;
    }
  ) => void;
};
class Dashboard extends React.Component<Props> {
  render() {
    const finalVizState =
      vizState ||
      (itemId && !loading && data && JSON.parse(data.dashboardItem.vizState)) ||
      {};

    return (
      <div>
        <TitleModal
          history={history}
          itemId={itemId}
          titleModalVisible={titleModalVisible}
          setTitleModalVisible={setTitleModalVisible}
          setAddingToDashboard={setAddingToDashboard}
          finalVizState={finalVizState}
          setTitle={setTitle}
          finalTitle={finalTitle}
        />
        <PageHeader
          noBorder={true}
          title={<Typography.Title level={4}>Chart</Typography.Title>}
          button={
            <Button
              key="button"
              type="primary"
              loading={addingToDashboard}
              disabled={!isQueryPresent(finalVizState.query || {})}
              onClick={() => setTitleModalVisible(true)}
            >
              {itemId ? 'Update' : 'Add to Dashboard'}
            </Button>
          }
        />
        <ExploreQueryBuilder
          vizState={finalVizState}
          setVizState={setVizState}
        />
      </div>
    );
  }
}

export default Dashboard;
