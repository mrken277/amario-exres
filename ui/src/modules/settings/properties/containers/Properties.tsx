import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { IRouterProps } from 'modules/common/types';
import { Alert } from 'modules/common/utils';
import { router } from 'modules/common/utils';
import React from 'react';
import { withRouter } from 'react-router';
import Properties from '../components/Properties';
import { FIELDS_GROUPS_CONTENT_TYPES } from '../constants';
import { mutations, queries } from '../graphql';
import {
  FieldsGroupsQueryResponse,
  FieldsGroupsRemoveMutationResponse,
  FieldsGroupsUpdateVisibleMutationResponse,
  FieldsRemoveMutationResponse,
  FieldsUpdateVisibleMutationResponse
} from '../types';
import {
  companyBasicInfos,
  customerBasicInfos,
  productBasicInfos
} from '../utils';

type Props = {
  queryParams: any;
};

type FinalProps = {} & Props & IRouterProps;

const PropertiesContainer = (props: FinalProps) => {
  const { queryParams, history } = props;

  if (!router.getParam(history, 'type')) {
    router.setParams(
      history,
      { type: FIELDS_GROUPS_CONTENT_TYPES.CUSTOMER },
      true
    );
  }

  const options = ({
    refetchQueries: [
      {
        query: gql`
          ${queries.fieldsGroups}
        `,
        variables: { contentType: queryParams.type }
      }
    ]
  });

  const {
    loading: fieldsGroupsQueryLoading,
    error: fieldsGroupsQueryError,
    data: fieldsGroupsQueryData
  } = useQuery<FieldsGroupsQueryResponse>(
    gql(queries.fieldsGroups),
    {
      variables: {
        contentType: queryParams.type || ''
      }
    }
  );

  const [removeFieldsGroups, { error: removeFieldsGroupsError, }] =
    useMutation<FieldsGroupsRemoveMutationResponse, { _id: string }>(
      gql(mutations.fieldsGroupsRemove),
      options
    );

  const [removeFields, { error: removeFieldsError }] =
    useMutation<FieldsRemoveMutationResponse, { _id: string }>(
      gql(mutations.fieldsRemove), options
    );

  const [updateFieldsGroups, { error: updateFieldsGroupsError }] =
    useMutation<FieldsGroupsUpdateVisibleMutationResponse, { _id: string; isVisible: boolean }>(
      gql(mutations.fieldsGroupsUpdateVisible), options
    );

  const [updateFields, { error: updateFieldsError }] =
    useMutation<FieldsUpdateVisibleMutationResponse, { _id: string; isVisible: boolean }>(
      gql(mutations.fieldsUpdateVisible), options
    );

  const removePropertyGroup = ({ _id }) => {
    removeFieldsGroups({
      variables: { _id }
    })
      .then(() => {
        Alert.success('You successfully deleted a property group');
      })
      .catch(e => {
        Alert.error(e.message);
      });
  };

  const removeProperty = ({ _id }) => {
    removeFields({
      variables: { _id }
    })
      .then(() => {
        Alert.success('You successfully deleted a property field');
      })
      .catch(e => {
        Alert.error(e.message);
      });
  };

  const updatePropertyVisible = ({ _id, isVisible }) => {
    updateFieldsGroups({
      variables: { _id, isVisible }
    })
      .then(() => {
        Alert.success('You changed a property field visibility');
      })
      .catch(e => {
        Alert.error(e.message);
      });
  };

  const updatePropertyGroupVisible = ({ _id, isVisible }) => {
    updateFields({
      variables: { _id, isVisible }
    })
      .then(() => {
        Alert.success('You changed a property group visibility');
      })
      .catch(e => {
        Alert.error(e.message);
      });
  };

  if (fieldsGroupsQueryError || removeFieldsGroupsError || removeFieldsError || updateFieldsGroupsError || updateFieldsError) {
    return <p>Error!</p>;
  }

  if (fieldsGroupsQueryLoading) {
    return <p>Loading...</p>;
  }

  const currentType = router.getParam(history, 'type');
  const fieldsGroups = [...(fieldsGroupsQueryData && fieldsGroupsQueryData.fieldsGroups || [])];

  // Initializing default properties for customer and company
  let defaultGroup = companyBasicInfos;

  if (queryParams.type === FIELDS_GROUPS_CONTENT_TYPES.CUSTOMER) {
    defaultGroup = customerBasicInfos;
  }

  if (queryParams.type === FIELDS_GROUPS_CONTENT_TYPES.PRODUCT) {
    defaultGroup = productBasicInfos;
  }

  fieldsGroups.unshift(defaultGroup);

  const updatedProps = {
    ...props,
    fieldsGroups,
    currentType,
    removePropertyGroup,
    removeProperty,
    updatePropertyVisible,
    updatePropertyGroupVisible
  };

  return <Properties {...updatedProps} />;
};

export default (withRouter<FinalProps>(PropertiesContainer));
