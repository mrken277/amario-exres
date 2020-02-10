import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import * as compose from 'lodash.flowright';
import ErrorMsg from 'modules/common/components/ErrorMsg';
import Spinner from 'modules/common/components/Spinner';
import { IRouterProps } from 'modules/common/types';
import { Alert, withProps } from 'modules/common/utils';
import checkError from 'modules/common/utils/checkError';
import React, { useState } from 'react';
import { withRouter } from 'react-router';
import { AllUsersQueryResponse } from '../../settings/team/types';
import { mutations, queries } from '../graphql';
import {
  EngageMessageDetailQueryResponse,
  IEngageMessage,
  WithFormAddMutationResponse,
  WithFormEditMutationResponse,
  WithFormMutationVariables
} from '../types';
import { crudMutationsOptions } from '../utils';

type Props = {
  messageId: string;
  kind: string;
};

type State = {
  isLoading: boolean;
};

type FinalProps = {
} & IRouterProps &
  Props;

function withSaveAndEdit<IComponentProps>(Component) {

  const Container = (props: FinalProps, state: State) => {
    const [isLoading, setLoading] = useState(false);
    const { history, kind, messageId } = props;

    const {
      loading: engageMessageDetailLoading,
      error: engageMessageDetailError,
      data: engageMessageDetailData
    } = useQuery<EngageMessageDetailQueryResponse, { _id: string }>(
      gql(queries.engageMessageDetail), {
      variables: {
        _id: messageId
      }
    });

    const {
      loading: usersLoading,
      error: usersError,
      data: usersData
    } = useQuery<AllUsersQueryResponse>(
      gql(queries.users));

    const [addMutation,
      { loading: messagesAddLoading,
        error: messagesAddError
      }] = useMutation<WithFormAddMutationResponse, WithFormMutationVariables>(
        gql(mutations.messagesAdd), {
        refetchQueries: [
          ...crudMutationsOptions().refetchQueries,
          'engageMessageDetail',
          'activityLogs'
        ]
      });

    const [editMutation,
      { loading: messagesEditLoading,
        error: messagesEditError
      }] = useMutation<WithFormEditMutationResponse, WithFormMutationVariables>(
        gql(mutations.messagesEdit), {
        refetchQueries: [
          ...crudMutationsOptions().refetchQueries,
          'engageMessageDetail'
        ]
      });

    if (engageMessageDetailError || usersError || messagesAddError || messagesEditError) {
      const error = checkError([engageMessageDetailError, usersError, messagesAddError, messagesEditError]);

      return <ErrorMsg>{error.message}</ErrorMsg>;
    };

    if (engageMessageDetailLoading || usersLoading || messagesAddLoading || messagesEditLoading) {
      return <Spinner objective={true} />;
    };

    const message = engageMessageDetailData ? engageMessageDetailData.engageMessageDetail : {} as IEngageMessage;
    const users = usersData ? usersData.allUsers : [];
    const verifiedUsers = users.filter(user => user.username) || [];

    const doMutation = (mutation, variables, msg) => {
      setLoading(true);

      mutation({
        variables
      })
        .then(() => {
          Alert.success(msg);
          history.push('/engage');

          setLoading(false);
        })
        .catch(error => {
          Alert.error(error.message);

          setLoading(false);
        });
    };

    // save
    const save = doc => {
      doc.kind = message.kind ? message.kind : kind;
      doc.scheduleDate = doc.kind !== 'manual' ? doc.scheduleDate : null;

      if (messageId) {
        return doMutation(
          editMutation,
          { ...doc, _id: messageId },
          `You successfully updated a engagement message`
        );
      }

      return doMutation(
        addMutation,
        doc,
        `You successfully added a engagement message`
      );
    };

    const messenger = message.messenger || {
      brandId: '',
      kind: '',
      content: '',
      sentAs: '',
      rules: []
    };

    const email = message.email || {
      subject: '',
      attachments: [],
      content: '',
      templateId: ''
    };

    const scheduleDate = message.scheduleDate || {
      type: '',
      month: '',
      day: '',
      time: ''
    };

    const updatedProps = {
      ...props,
      save,
      users: verifiedUsers,
      isActionLoading: isLoading,
      message: {
        ...message,
        // excluding __type auto fields
        messenger: {
          brandId: messenger.brandId,
          kind: messenger.kind,
          content: messenger.content,
          sentAs: messenger.sentAs,
          rules: messenger.rules
        },
        email: {
          subject: email.subject,
          attachments: email.attachments,
          content: email.content,
          templateId: email.templateId
        },
        scheduleDate: {
          type: scheduleDate.type,
          month: scheduleDate.month,
          day: scheduleDate.day,
          time: scheduleDate.time
        }
      }
    };

    return <Component {...updatedProps} />
  }

  return withProps<IComponentProps>(
    compose(
      (withRouter<FinalProps>(Container))
    )
  );
  // return withRouter<FinalProps>(Container);
}

export default withSaveAndEdit;