import gql from 'graphql-tag';
import { Alert } from 'modules/common/utils';
import { IIntegration } from 'modules/settings/integrations/types';
import { FieldsQueryResponse, IField } from 'modules/settings/properties/types';
import React, { useEffect } from 'react';
import Form from '../components/Form';
import { mutations, queries } from '../graphql';
import {
  AddFieldMutationResponse,
  AddFieldMutationVariables,
  EditFieldMutationResponse,
  EditFieldMutationVariables,
  EditFormMutationResponse,
  EditFormMutationVariables,
  FormDetailQueryResponse,
  IFormData,
  RemoveFieldMutationResponse,
  RemoveFieldMutationVariables
} from '../types';

import { useMutation, useQuery } from '@apollo/react-hooks';
import ErrorMsg from 'modules/common/components/ErrorMsg';
import Spinner from 'modules/common/components/Spinner';
import { IRouterProps } from 'modules/common/types';
import checkError from 'modules/common/utils/checkError';
import { withRouter } from 'react-router';
import { defaultProps } from 'recompose';

type Props = {
  renderPreviewWrapper: (previewRenderer, fields: IField[]) => void;
  afterDbSave: (formId: string) => void;
  onDocChange?: (doc: IFormData) => void;
  onInit?: (fields: IField[]) => void;
  type: string;
  isReadyToSave: boolean;
  formId: string;
  integration?: IIntegration;
  showMessage?: boolean;
};

type FinalProps = {
} & IRouterProps & Props

function EditFormContainer(props: FinalProps) {
  const withDefaultProps = defaultProps({
    showMessage: true
  });

  const { formId, afterDbSave } = props;

  const {
    data: fieldsData,
    error: fieldsError,
    loading: fieldsLoading,
    refetch: fieldsRefetch,
  } = useQuery<FieldsQueryResponse, { contentType: string; contentTypeId: string }>(
    gql(queries.fields), {
    variables: {
      contentType: 'form',
      contentTypeId: formId
    },
    fetchPolicy: 'network-only'
  }
  );

  useEffect(() => {
    const { onInit } = props;

    if (fieldsLoading && !fieldsLoading && onInit) {
      onInit((fieldsData && fieldsData.fields) || []);
    }
  });

  const {
    data: formDetailData,
    error: formDetailError,
    loading: formDetailLoading
  } = useQuery<FormDetailQueryResponse, { _id: string }>(
    gql(queries.formDetail), {
    variables: {
      _id: formId
    }
  }
  );

  const [
    addFieldMutation,
    { error: addFieldError, loading: addFieldLoading }
  ] = useMutation<AddFieldMutationResponse, AddFieldMutationVariables>(
    gql(mutations.fieldsAdd));

  const [
    editFormMutation,
    { error: editFormError, loading: editFormLoading, data: editFormData }
  ] = useMutation<EditFormMutationResponse, EditFormMutationVariables>(
    gql(mutations.editForm));

  const [
    editFieldMutation,
    { error: editFieldError, loading: editFieldLoading }
  ] = useMutation<EditFieldMutationResponse, EditFieldMutationVariables>(
    gql(mutations.fieldsEdit));

  const [
    removeFieldMutation,
    { error: removeFieldError, loading: removeFieldLoading }
  ] = useMutation<RemoveFieldMutationResponse, RemoveFieldMutationVariables>(
    gql(mutations.fieldsRemove));

  if (fieldsLoading || formDetailLoading || removeFieldLoading || editFieldLoading || editFormLoading || addFieldLoading) {
    return <Spinner objective={true} />;
  }

  const dbFields = (fieldsData && fieldsData.fields) || [];
  const form = formDetailData && formDetailData.formDetail;

  if (fieldsError || formDetailError || addFieldError || editFieldError || removeFieldError) {
    const error = checkError([fieldsError, formDetailError, addFieldError, editFieldError, removeFieldError]);

    return <ErrorMsg>{error.message}</ErrorMsg>;
  }

  const saveForm = doc => {
    const { title, desc, btnText, fields, type } = doc;

    editFormMutation({
      variables: {
        _id: formId,
        title,
        description: desc,
        buttonText: btnText,
        type
      }
    })
      .then(() => {
        const dbFieldIds = dbFields.map(field => field._id);
        const existingIds: string[] = [];
        const createFieldsData: IField[] = [];
        const updateFieldsData: IField[] = [];
        const removeFieldsData: Array<{ _id: string }> = [];

        // collect fields ================
        for (const field of fields) {
          // collect fields to update
          if (dbFieldIds.includes(field._id)) {
            existingIds.push(field._id);
            updateFieldsData.push(field);
            continue;
          }

          // collect fields to create
          delete field._id;

          createFieldsData.push({
            ...field,
            contentType: 'form',
            contentTypeId: formId
          });
        }

        // collect fields to remove
        for (const dbFieldId of dbFieldIds) {
          if (!existingIds.includes(dbFieldId || '')) {
            removeFieldsData.push({ _id: dbFieldId || '' });
          }
        }

        // save fields ===================
        const promises: any[] = [];

        const doMutation = ({ datas, mutation }) => {
          for (const data of datas) {
            promises.push(mutation({ variables: data }));
          }
        };

        doMutation({ datas: createFieldsData, mutation: addFieldMutation });
        doMutation({ datas: updateFieldsData, mutation: editFieldMutation });
        doMutation({
          datas: removeFieldsData,
          mutation: removeFieldMutation
        });

        return Promise.all(promises);
      })

    if (editFormData) {
      if (withDefaultProps) {
        Alert.success('You successfully updated a form');
      }

      fieldsRefetch().then(() => {
        afterDbSave(formId);
      });
    }

    if (editFormError) {
      Alert.error(editFormError.message);
    }
  };

  const updatedProps = {
    ...props,
    fields: dbFields.map(field => ({ ...field })),
    saveForm,
    form
  };

  return <Form {...updatedProps} />;
}

export default withRouter<FinalProps>(EditFormContainer);