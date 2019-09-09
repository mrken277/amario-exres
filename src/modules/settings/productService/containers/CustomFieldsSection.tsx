import gql from 'graphql-tag';
import Spinner from 'modules/common/components/Spinner';
import Sidebar from 'modules/layout/components/Sidebar';
import GenerateCustomFields from 'modules/settings/properties/components/GenerateCustomFields';
import { queries as fieldQueries } from 'modules/settings/properties/graphql';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import { withProps } from '../../../common/utils';
import { FieldsGroupsQueryResponse } from '../../../settings/properties/types';
import { mutations } from '../graphql';
import { EditMutationResponse, IProduct } from '../types';

type Props = {
  product: IProduct;
  loading?: boolean;
  contentType: string;
};

type FinalProps = {
  fieldsGroupsQuery: FieldsGroupsQueryResponse;
} & Props &
  EditMutationResponse;

const CustomFieldsSection = (props: FinalProps) => {
  const { product, editMutation, fieldsGroupsQuery, loading } = props;

  if (fieldsGroupsQuery.loading) {
    return (
      <Sidebar full={true}>
        <Spinner />
      </Sidebar>
    );
  }

  const { _id } = product;

  const save = (variables, callback) => {
    editMutation({
      variables: { _id, ...variables }
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
    customFieldsData: product.customFieldsData || {},
    fieldsGroups: fieldsGroupsQuery.fieldsGroups || []
  };

  return <GenerateCustomFields {...updatedProps} />;
};

export default withProps<Props>(
  compose(
    graphql<Props, FieldsGroupsQueryResponse, { contentType: string }>(
      gql(fieldQueries.fieldsGroups),
      {
        name: 'fieldsGroupsQuery',
        options: ({ contentType }) => ({
          variables: {
            contentType
          }
        })
      }
    ),

    // mutations
    graphql<Props, EditMutationResponse, IProduct>(gql(mutations.productEdit), {
      name: 'editMutation',
      options: () => ({
        refetchQueries: ['products']
      })
    })
  )(CustomFieldsSection)
);
