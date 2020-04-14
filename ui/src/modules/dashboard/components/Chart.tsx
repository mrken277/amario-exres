import React from 'react';

import { IDashboardItem } from '../types';

type Props = {
  dashboardItem: IDashboardItem;
  editDashboardItem: (
    doc: {
      _id: string;
      layout: string;
    }
  ) => void;
};
class Dashboard extends React.Component<Props> {
  constructor() {
    state;
  }
  render() {
    const { dashboardItem } = this.props;
    const finalVizState = vizState || JSON.parse(dashboardItem.vizState) || {};

    return (
      <div>
        <ExploreQueryBuilder
          vizState={finalVizState}
          setVizState={setVizState}
        />
      </div>
    );
  }
}

export default Dashboard;
