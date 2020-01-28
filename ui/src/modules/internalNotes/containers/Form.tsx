import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import Form from '../components/Form';
import { mutations } from '../graphql';
import {
  InternalNotesAddMutationResponse,
  InternalNotesAddMutationVariables
} from '../types';

type Props = {
  contentType: string;
  contentTypeId: string;
};

type State = {
  isLoading: boolean;
};

function FormContainer(props: Props, state: State) {
  const { contentType, contentTypeId } = props;
  const [isLoading, setLoading] = useState(false);

  const [internalNotesAdd] = useMutation<InternalNotesAddMutationResponse, InternalNotesAddMutationVariables>(gql(mutations.internalNotesAdd), {
    refetchQueries: ['activityLogs']
  });

  // create internalNote
  const create = (variables, callback: () => void) => {
    setLoading(true);

    internalNotesAdd({
      variables: {
        contentType,
        contentTypeId,
        ...variables
      }
    }).then(() => {
      callback();

      setLoading(false);
    });
  };

  return <Form save={create} isActionLoading={isLoading} />;
}
export default FormContainer;
