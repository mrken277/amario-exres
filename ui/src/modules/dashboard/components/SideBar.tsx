import LeftSidebar from 'modules/layout/components/Sidebar';
import { SidebarList as List } from 'modules/layout/styles';
import React from 'react';
import { Link } from 'react-router-dom';
type Props = {
  dashboardId: string;
};

class Sidebar extends React.Component<Props> {
  renderListItem(url: string, text: string, isAll: boolean) {
    if (!isAll) {
      return (
        <li>
          <Link
            to={url}
            className={window.location.href.includes(url) ? 'active' : ''}
          >
            {text}
          </Link>
        </li>
      );
    }

    return (
      <li>
        <Link
          to={url}
          className={window.location.href.includes('?type') ? '' : 'active'}
        >
          {text}
        </Link>
      </li>
    );
  }

  renderSidebarHeader() {
    const { Header } = LeftSidebar;

    return <Header uppercase={true}>Categories</Header>;
  }

  render() {
    const { dashboardId } = this.props;

    return (
      <LeftSidebar full={true} header={this.renderSidebarHeader()}>
        <List>
          {this.renderListItem(
            `/dashboard/reports/${dashboardId}`,
            'All',
            true
          )}
          {this.renderListItem(
            `/dashboard/reports/${dashboardId}?type=customers`,
            'Customer',
            false
          )}
          {this.renderListItem(
            `/dashboard/reports/${dashboardId}?type=conversations`,
            'Conversation',
            false
          )}
          {this.renderListItem(
            `/dashboard/reports/${dashboardId}?type=deals`,
            'Deal',
            false
          )}
        </List>
      </LeftSidebar>
    );
  }
}

export default Sidebar;
