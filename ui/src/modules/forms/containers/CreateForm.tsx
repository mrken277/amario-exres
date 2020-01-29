import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Alert } from 'modules/common/utils';
import {
  AddFieldsMutationResponse,
  AddFieldsMutationVariables,
  IField
} from 'modules/settings/properties/types';
import React from 'react';
import { defaultProps } from 'recompose';
import Form from '../components/Form';
import { mutations } from '../graphql';
import {
  AddFormMutationResponse,
  AddFormMutationVariables,
  IFormData
} from '../types';

type Props = {
  renderPreviewWrapper: (previewRenderer, fields: IField[]) => void;
  afterDbSave: (formId: string) => void;
  onDocChange?: (doc: IFormData) => void;
  type: string;
  isReadyToSave: boolean;
  showMessage?: boolean;
  history: any;
};

function CreateFormContainer(props: Props) {
  const withDefaultProps = defaultProps({
    showMessage: true
  });

  // const { afterDbSave } = props;

  const [
    addFormMutation,
    { error: addFormError, data: addFormData }
  ] = useMutation<AddFormMutationResponse, AddFormMutationVariables>(
    gql(mutations.addForm),
    {
      refetchQueries: ['fields']
    }
  );

  const [
    addFieldsMutation,
    { error: addFieldsError }
  ] = useMutation<AddFieldsMutationResponse, AddFieldsMutationVariables>(
    gql(mutations.fieldsAdd));

  if (addFieldsError) {
    Alert.error(addFieldsError.message);
  };

  const saveForm = doc => {
    // let formId;
    const { title, desc, btnText, fields, type } = doc;

    addFormMutation({
      variables: {
        title,
        description: desc,
        buttonText: btnText,
        type
      }
    })
      .then(({ data }) => {
        // formId = data.formsAdd._id;

        // afterDbSave(formId);
      })

      .then(() => {
        const promises: any[] = [];

        for (const [i, field] of fields.entries()) {
          promises.push(
            addFieldsMutation({
              variables: {
                order: i,
                // contentTypeId: formId,
                contentTypeId: '',
                ...field
              }
            })
          );
        }

        return Promise.all(promises);
      })

    if (addFormData) {
      if (withDefaultProps) {
        Alert.success('You successfully added a form');
      }
    }

    if (addFormError) {
      Alert.error(addFormError.message);
    };
  };

  const updatedProps = {
    ...props,
    fields: [],
    saveForm
  };

  return <Form {...updatedProps} />;
}
export default CreateFormContainer;
