import client from 'apolloClient';
import gql from 'graphql-tag';
import * as compose from 'lodash.flowright';
import { Alert, withProps } from 'modules/common/utils';
import { mutations, queries } from 'modules/cars/graphql';
import ActionSection from 'modules/customers/components/common/ActionSection';
import React from 'react';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { IUser } from '../../../auth/types';
import { IRouterProps } from '../../../common/types';
import {
  ICar,
  MergeMutationResponse,
  MergeMutationVariables,
  RemoveMutationResponse,
  RemoveMutationVariables
} from '../../types';

type Props = {
  car: ICar;
};

type FinalProps = { currentUser: IUser } & Props &
  IRouterProps &
  RemoveMutationResponse &
  MergeMutationResponse;

const BasicInfoContainer = (props: FinalProps) => {
  const { car, carsRemove, carsMerge, history } = props;

  const { _id } = car;

  const remove = () => {
    carsRemove({ variables: { carIds: [_id] } })
      .then(() => {
        Alert.success('You successfully deleted a car');
        history.push('/cars');
      })
      .catch(e => {
        Alert.error(e.message);
      });
  };

  const merge = ({ ids, data }) => {
    carsMerge({
      variables: {
        carIds: ids,
        carFields: data
      }
    })
      .then(response => {
        Alert.success('You successfully merged cars');
        history.push(`/cars/details/${response.data.carsMerge._id}`);
      })
      .catch(e => {
        Alert.error(e.message);
      });
  };

  const searchCar = (searchValue: string, callback: (data?: any) => void) => {
    client
      .query({
        query: gql(queries.cars),
        variables: { searchValue, page: 1, perPage: 10 }
      })
      .then(
        (response: any): void => {
          if (typeof callback === 'function') {
            callback(response.data.cars);
          }
        }
      )
      .catch(error => {
        Alert.error(error.message);
      });
  };

  const updatedProps = {
    ...props,
    coc: car,
    cocType: 'car',
    remove,
    merge,
    search: searchCar
  };

  return <ActionSection {...updatedProps} />;
};

const generateOptions = () => ({
  refetchQueries: ['companieMain', 'carCounts']
});

export default withProps<Props>(
  compose(
    graphql<{}, RemoveMutationResponse, RemoveMutationVariables>(
      gql(mutations.carsRemove),
      {
        name: 'carsRemove',
        options: generateOptions
      }
    ),
    graphql<{}, MergeMutationResponse, MergeMutationVariables>(
      gql(mutations.carsMerge),
      {
        name: 'carsMerge',
        options: generateOptions
      }
    )
  )(withRouter<FinalProps>(BasicInfoContainer))
);
