import gql from 'graphql-tag';
export const GET_DASHBOARD_ITEMS = gql`
  query GetDashboardItems {
    dashboardItems {
      id
      layout
      vizState
      name
    }
  }
`;
export const GET_DASHBOARD_ITEM = gql`
  query GetDashboardItem($id: String!) {
    dashboardItem(id: $id) {
      id
      layout
      vizState
      name
    }
  }
`;

const dashboards = `
  query dashboards($page: Int, $perPage: Int) {
    dashboards(page: $page, perPage: $perPage) {
	    _id
	    name
	  }
  }
`;

const totalCount = `
  query dashboardsTotalCount {
	  dashboardsTotalCount
  }
`;

export default {
  totalCount,
  dashboards
};
