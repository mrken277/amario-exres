import { getEnv } from 'apolloClient';
import gql from 'graphql-tag';
import * as compose from 'lodash.flowright';
import Bulk from 'modules/common/components/Bulk';
import { Alert, withProps } from 'modules/common/utils';
import { generatePaginationParams } from 'modules/common/utils/router';
import queryString from 'query-string';
import React from 'react';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { IRouterProps } from '../../common/types';
import { DefaultColumnsConfigQueryResponse } from '../../settings/properties/types';
import CarsList from '../components/list/CarsList';
import { mutations, queries } from '../graphql';
import {
  ListConfigQueryResponse,
  ListQueryVariables,
  MainQueryResponse,
  MergeMutationResponse,
  MergeMutationVariables,
  RemoveMutationResponse,
  RemoveMutationVariables
} from '../types';

type Props = {
  queryParams?: any;
};

type FinalProps = {
  carsMainQuery: MainQueryResponse;
  carsListConfigQuery: DefaultColumnsConfigQueryResponse;
} & Props &
  IRouterProps &
  RemoveMutationResponse &
  MergeMutationResponse;

type State = {
  loading: boolean;
};

class CarListContainer extends React.Component<FinalProps, State> {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };
  }

  render() {
    const {
      carsMainQuery,
      carsListConfigQuery,
      carsRemove,
      carsMerge,
      history
    } = this.props;
    let columnsConfig = carsListConfigQuery.fieldsDefaultColumnsConfig || [];

    // load config from local storage
    const localConfig = localStorage.getItem('erxes_cars_columns_config');

    if (localConfig) {
      columnsConfig = JSON.parse(localConfig).filter(conf => conf.checked);
    }

    const removeCars = ({ carIds }, emptyBulk) => {
      carsRemove({
        variables: { carIds }
      })
        .then(() => {
          emptyBulk();
          Alert.success('You successfully deleted a car');
        })
        .catch(e => {
          Alert.error(e.message);
        });
    };

    const mergeCars = ({ ids, data, callback }) => {
      carsMerge({
        variables: {
          carIds: ids,
          carFields: data
        }
      })
        .then(response => {
          Alert.success('You successfully merged cars');
          callback();
          history.push(`/cars/details/${response.data.carsMerge._id}`);
        })
        .catch(e => {
          Alert.error(e.message);
        });
    };

    const searchValue = this.props.queryParams.searchValue || '';
    const { list = [], totalCount = 0 } = carsMainQuery.carsMain || {};

    const exportCars = bulk => {
      const { REACT_APP_API_URL } = getEnv();
      const { queryParams } = this.props;

      // queryParams page parameter needs convert to int.
      if (queryParams.page) {
        queryParams.page = parseInt(queryParams.page, 10);
      }

      if (bulk.length > 0) {
        queryParams.ids = bulk.map(car => car._id);
      }

      const stringified = queryString.stringify({
        ...queryParams,
        type: 'car'
      });

      window.open(`${REACT_APP_API_URL}/file-export?${stringified}`, '_blank');
    };

    const updatedProps = {
      ...this.props,
      columnsConfig,
      totalCount,
      searchValue,
      cars: list,
      loading: carsMainQuery.loading || this.state.loading,
      exportCars,
      removeCars,
      mergeCars
    };

    const carsList = props => {
      return <CarsList {...updatedProps} {...props} />;
    };

    const refetch = () => {
      this.props.carsMainQuery.refetch();
    };

    return <Bulk content={carsList} refetch={refetch} />;
  }
}

const generateParams = ({ queryParams }) => ({
  variables: {
    ...generatePaginationParams(queryParams),
    segment: queryParams.segment,
    tag: queryParams.tag,
    brand: queryParams.brand,
    ids: queryParams.ids,
    searchValue: queryParams.searchValue,
    sortField: queryParams.sortField,
    sortDirection: queryParams.sortDirection
      ? parseInt(queryParams.sortDirection, 10)
      : undefined
  }
});

export default withProps<Props>(
  compose(
    graphql<{ queryParams: any }, MainQueryResponse, ListQueryVariables>(
      gql(queries.carsMain),
      {
        name: 'carsMainQuery',
        options: generateParams
      }
    ),
    graphql<{}, ListConfigQueryResponse, {}>(gql(queries.carsListConfig), {
      name: 'carsListConfigQuery'
    }),
    // mutations
    graphql<{}, RemoveMutationResponse, RemoveMutationVariables>(
      gql(mutations.carsRemove),
      {
        name: 'carsRemove'
      }
    ),
    graphql<{}, MergeMutationResponse, MergeMutationVariables>(
      gql(mutations.carsMerge),
      {
        name: 'carsMerge',
        options: {
          refetchQueries: ['carsMain', 'carCounts']
        }
      }
    )
  )(withRouter<IRouterProps>(CarListContainer))
);
