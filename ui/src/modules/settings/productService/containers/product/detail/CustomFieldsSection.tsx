import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Spinner from 'modules/common/components/Spinner';
import Sidebar from 'modules/layout/components/Sidebar';
import {
  EditMutationResponse,
  IProduct
} from 'modules/settings/productService/types';
import GenerateCustomFields from 'modules/settings/properties/components/GenerateCustomFields';
import { FIELDS_GROUPS_CONTENT_TYPES } from 'modules/settings/properties/constants';
import { queries as fieldQueries } from 'modules/settings/properties/graphql';
import React from 'react';
import { FieldsGroupsQueryResponse } from '../../../../../settings/properties/types';
import { mutations } from '../../../graphql';

type Props = {
  product: IProduct;
  loading?: boolean;
};

const CustomFieldsSection = (props: Props) => {
  const { loading, product } = props;

  const {
    loading: fieldsGroupsQueryLoading,
    error: fieldsGroupsQueryError,
    data: fieldsGroupsQueryData
  } = useQuery<FieldsGroupsQueryResponse, { contentType: string }>(
    gql(fieldQueries.fieldsGroups),
    {
      variables: { contentType: FIELDS_GROUPS_CONTENT_TYPES.PRODUCT }
    }
  );

  const [editMutation, { error: editMutationError }] =
    useMutation<EditMutationResponse, IProduct>(
      gql(mutations.productEdit), {
      refetchQueries: ['companyDetail']
    });

  if (fieldsGroupsQueryError || editMutationError) {
    return <p>Error!</p>;
  }

  if (fieldsGroupsQueryLoading) {
    return (
      <Sidebar full={true}>
        <Spinner />
      </Sidebar>
    );
  }

  const { _id } = product;

  const save = (data, callback) => {
    editMutation({
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
    customFieldsData: product.customFieldsData || {},
    fieldsGroups: fieldsGroupsQueryData ? fieldsGroupsQueryData.fieldsGroups : []
  };

  return <GenerateCustomFields {...updatedProps} />;
};

export default CustomFieldsSection;
