import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import withCurrentUser from 'modules/auth/containers/withCurrentUser';
import { IUser } from 'modules/auth/types';
import ErrorMsg from 'modules/common/components/ErrorMsg';
import Spinner from 'modules/common/components/Spinner';
import { Alert } from 'modules/common/utils';
import checkError from 'modules/common/utils/checkError';
import { ICustomer } from 'modules/customers/types';
import { AddMutationResponse, IEngageMessageDoc } from 'modules/engage/types';
import { IEmailTemplate } from 'modules/settings/emailTemplates/types';
import React from 'react';
import { BrandsQueryResponse, IBrand } from '../../settings/brands/types';
import { EmailTemplatesQueryResponse } from '../../settings/emailTemplates/containers/List';
import Widget from '../components/Widget';
import { MESSAGE_KINDS, MESSENGER_KINDS, SENT_AS_CHOICES } from '../constants';
import { mutations, queries } from '../graphql';

type Props = {
  customers: ICustomer[];
  emptyBulk?: () => void;
  modalTrigger?: React.ReactNode;
  channelType?: string;
};

type FinalProps = {
  currentUser: IUser;
} & Props;

const WidgetContainer = (props: FinalProps) => {
  const {
    currentUser,
    emptyBulk,
  } = props;

  const {
    loading: emailTemplatesLoading,
    error: emailTemplatesError,
    data: emailTemplatesData
  } = useQuery<EmailTemplatesQueryResponse>(
    gql(queries.emailTemplates));

  const {
    loading: brandsLoading,
    error: brandsError,
    data: brandsData
  } = useQuery<BrandsQueryResponse>(
    gql(queries.brands));

  const [messagesAddMutation,
    {
      loading: messagesAddLoading,
      error: messagesAddError,
      data: messagesAddData
    }] = useMutation<AddMutationResponse, IEngageMessageDoc>(
      gql(mutations.messagesAdd), {
      refetchQueries: [
        'engageMessages',
        'engageMessagesTotalCount',
        'kindCounts',
        'statusCounts'
      ]
    });

  if (emailTemplatesLoading || brandsLoading || messagesAddLoading) {
    return <Spinner objective={true} />;
  }

  if (emailTemplatesError || brandsError) {
    const error = checkError([emailTemplatesError, brandsError,
    ]);

    return <ErrorMsg>{error.message}</ErrorMsg>;
  };

  const emailTemplates = emailTemplatesData && emailTemplatesData.emailTemplates as IEmailTemplate[];
  const brands = brandsData && brandsData.brands as IBrand[];

  // save
  const save = (doc, callback) => {
    doc.kind = MESSAGE_KINDS.MANUAL;
    doc.isLive = true;
    doc.fromUserId = currentUser._id;

    messagesAddMutation({
      variables: doc
    })
    if (messagesAddData) {
      callback();

      Alert.success(`You successfully added a engagement message`);

      if (emptyBulk) {
        emptyBulk();
      }
    }

    if (messagesAddError) {
      Alert.error(messagesAddError.message);
    };
  };

  const updatedProps = {
    ...props,
    emailTemplates,
    brands,
    save,
    messengerKinds: MESSENGER_KINDS.SELECT_OPTIONS,
    sentAsChoices: SENT_AS_CHOICES.SELECT_OPTIONS
  };

  return <Widget {...updatedProps} />;
};

export default withCurrentUser(WidgetContainer);
