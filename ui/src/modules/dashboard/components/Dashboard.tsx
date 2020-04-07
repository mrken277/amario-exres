import React from 'react';
import RGL, { WidthProvider } from 'react-grid-layout';

import { Button, Typography } from 'antd';

import { Icon } from '@ant-design/compatible';
import { Link } from 'react-router-dom';
import { IDashboardItem } from '../types';
import ChartRenderer from './ChartRenderer';
import DashboardItem from './DashboardItem';
import PageHeader from './PageHeader';

const ReactGridLayout = WidthProvider(RGL);

const deserializeItem = i => ({
  ...i,
  layout: JSON.parse(i.layout) || {},
  vizState: JSON.parse(i.vizState)
});

const defaultLayout = i => ({
  x: i.layout.x || 0,
  y: i.layout.y || 0,
  w: i.layout.w || 4,
  h: i.layout.h || 8,
  minW: 4,
  minH: 8
});

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
  onLayoutChange = newLayout => {
    const { dashboardItems, editDashboardItem } = this.props;

    newLayout.forEach(l => {
      const item = dashboardItems.find(i => i._id.toString() === l.i);
      const toUpdate = JSON.stringify({
        x: l.x,
        y: l.y,
        w: l.w,
        h: l.h
      });

      if (item && toUpdate !== item.layout) {
        editDashboardItem({
          _id: item._id,
          layout: toUpdate
        });
      }
    });
  };

  render() {
    const { dashboardItems } = this.props;

    if (dashboardItems.length === 0) {
      return (
        <div
          style={{
            textAlign: 'center',
            padding: 12
          }}
        >
          <h2>There are no charts on this dashboard</h2>
          <Link to="/explore">
            <Button type="primary" size="large" icon={<Icon type="plus" />}>
              Add chart
            </Button>
          </Link>
        </div>
      );
    }

    const dashboardItem = item => (
      <div key={item._id} data-grid={defaultLayout(item)}>
        <DashboardItem key={item._id} itemId={item._id} title={item.name}>
          <ChartRenderer vizState={item.vizState} />
        </DashboardItem>
      </div>
    );

    return (
      <ReactGridLayout
        cols={12}
        rowHeight={50}
        onLayoutChange={this.onLayoutChange}
      >
        <PageHeader
          noBorder={true}
          title={<Typography.Title level={4}>Dashboard</Typography.Title>}
          button={
            <Link to="/explore">
              <Button type="primary">Add chart</Button>
            </Link>
          }
        />

        {dashboardItems.map(deserializeItem).map(dashboardItem)}
      </ReactGridLayout>
    );
  }
}

export default Dashboard;
