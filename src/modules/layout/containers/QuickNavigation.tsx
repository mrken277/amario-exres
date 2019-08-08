import client from 'apolloClient';
import { AppConsumer } from 'appContext';
import gql from 'graphql-tag';
import { IOption } from 'modules/common/types';
import { Alert, getCookie, setCookie, withProps } from 'modules/common/utils';
import { queries as brandQueries } from 'modules/settings/brands/graphql';
import { BrandsQueryResponse } from 'modules/settings/brands/types';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import QuickNavigation from '../components/QuickNavigation';

type Props = {
  brandsQuery: BrandsQueryResponse;
};

type State = {
  selectedBrands: IOption[];
};

class QuickNavigationContainer extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    const cookieValue = getCookie('scopeBrandIds');

    this.state = { selectedBrands: cookieValue ? JSON.parse(cookieValue) : [] };
  }

  logout = () => {
    client
      .mutate({
        mutation: gql`
          mutation {
            logout
          }
        `
      })

      .then(() => {
        window.location.href = '/';
      })
      .catch(error => {
        Alert.error(error.message);
      });
  };

  onChangeBrands = (options: IOption[]) => {
    const { brandsQuery } = this.props;

    let ids = options.map(option => option.value);

    if (ids.length === 0) {
      ids = (brandsQuery.brands || []).map(brand => brand._id);
    }

    setCookie('scopeBrandIds', JSON.stringify(ids));

    this.setState({ selectedBrands: options });
  };

  render() {
    const { brandsQuery } = this.props;

    return (
      <AppConsumer>
        {({ currentUser }) =>
          currentUser && (
            <QuickNavigation
              onChangeBrands={this.onChangeBrands}
              brands={brandsQuery.brands || []}
              selectedBrands={this.state.selectedBrands}
              logout={this.logout}
              currentUser={currentUser}
            />
          )
        }
      </AppConsumer>
    );
  }
}

export default withProps(
  compose(
    graphql<{}, BrandsQueryResponse>(gql(brandQueries.brands), {
      name: 'brandsQuery',
      options: () => ({
        fetchPolicy: 'network-only'
      })
    })
  )(QuickNavigationContainer)
);
