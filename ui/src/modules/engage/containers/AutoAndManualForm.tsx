import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { IUser } from 'modules/auth/types';
import ErrorMsg from 'modules/common/components/ErrorMsg';
import Spinner from 'modules/common/components/Spinner';
import { IBrand } from 'modules/settings/brands/types';
import React from 'react';
import { EmailTemplatesQueryResponse } from '../../settings/emailTemplates/containers/List';
import AutoAndManualForm from '../components/AutoAndManualForm';
import FormBase from '../components/FormBase';
import { queries } from '../graphql';
import { IEngageMessageDoc, IEngageScheduleDate } from '../types';
import withFormMutations from './withFormMutations';

type Props = {
  kind?: string;
  brands: IBrand[];
  scheduleDate?: IEngageScheduleDate;
};

type FinalProps = {
  emailTemplatesQuery: EmailTemplatesQueryResponse;
  users: IUser[];
  isActionLoading: boolean;
  save: (doc: IEngageMessageDoc) => Promise<any>;
} & Props;

function AutoAndManualFormContainer(props: FinalProps) {

  const {
    loading: emailTemplatesLoading,
    error: emailTemplatesError,
    data: emailTemplatesData
  } = useQuery<EmailTemplatesQueryResponse>(
    gql(queries.emailTemplates));

  if (emailTemplatesLoading) {
    return <Spinner objective={true} />;
  };

  if (emailTemplatesError) {
    return <ErrorMsg>{emailTemplatesError.message}</ErrorMsg>;
  };

  const updatedProps = {
    ...props,
    templates: emailTemplatesData ? emailTemplatesData.emailTemplates : []
  };

  const content = formProps => (
    <AutoAndManualForm {...updatedProps} {...formProps} />
  );

  return <FormBase kind={props.kind || ''} content={content} />;
};

export default withFormMutations<Props>(AutoAndManualFormContainer);
