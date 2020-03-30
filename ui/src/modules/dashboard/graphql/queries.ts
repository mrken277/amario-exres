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
  query dashboards {
    dashboards {
	    _id
	    name
	  }
  }
`;

export default {
  dashboards
};
