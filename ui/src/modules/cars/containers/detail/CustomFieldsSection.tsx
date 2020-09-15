import gql from 'graphql-tag';
import * as compose from 'lodash.flowright';
import Spinner from 'modules/common/components/Spinner';
import Sidebar from 'modules/layout/components/Sidebar';
import GenerateCustomFields from 'modules/settings/properties/components/GenerateCustomFields';
import { FIELDS_GROUPS_CONTENT_TYPES } from 'modules/settings/properties/constants';
import { queries as fieldQueries } from 'modules/settings/properties/graphql';
import React from 'react';
import { graphql } from 'react-apollo';
import { withProps } from 'modules/common/utils';
import { FieldsGroupsQueryResponse } from 'modules/settings/properties/types';
import { mutations } from '../../graphql';
import { EditMutationResponse, ICar } from '../../types';

type Props = {
  car: ICar;
  loading?: boolean;
};

type FinalProps = {
  fieldsGroupsQuery: FieldsGroupsQueryResponse;
} & Props &
  EditMutationResponse;

const CustomFieldsSection = (props: FinalProps) => {
  const { loading, car, carsEdit, fieldsGroupsQuery } = props;

  if (fieldsGroupsQuery.loading) {
    return (
      <Sidebar full={true}>
        <Spinner />
      </Sidebar>
    );
  }

  const { _id } = car;

  const save = (data, callback) => {
    carsEdit({
      variables: { _id, ...data }
    })
      .then(() => {
        callback();
      })
      .catch(e => {
        callback(e);
      });
  };

  const updatedProps = {
    save,
    loading,
    customFieldsData: car.customFieldsData,
    fieldsGroups: fieldsGroupsQuery.fieldsGroups || []
  };

  return <GenerateCustomFields {...updatedProps} />;
};

const options = () => ({
  refetchQueries: ['companDetail']
});

export default withProps<Props>(
  compose(
    graphql<Props, FieldsGroupsQueryResponse, { contentType: string }>(
      gql(fieldQueries.fieldsGroups),
      {
        name: 'fieldsGroupsQuery',
        options: () => ({
          variables: {
            contentType: FIELDS_GROUPS_CONTENT_TYPES.CAR
          }
        })
      }
    ),
    graphql<Props, EditMutationResponse, ICar>(gql(mutations.carsEdit), {
      name: 'carsEdit',
      options
    })
  )(CustomFieldsSection)
);
