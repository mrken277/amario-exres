import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import ButtonMutate from 'modules/common/components/ButtonMutate';
import { IButtonMutateProps } from 'modules/common/types';
import { Alert, confirm } from 'modules/common/utils';
import { queries as engageQueries } from 'modules/engage/graphql';
import { mutations as engageMutations } from 'modules/engage/graphql';
import {
  EngageConfigQueryResponse,
  EngageVerifiedEmailsQueryResponse,
  IEngageConfig
} from 'modules/engage/types';
import React from 'react';
import Settings from '../../components/engages/Settings';
import { queries } from '../../graphql';

type Props = {
  closeModal: () => void;
};

const SettingsContainer = (props: Props) => {
  const { closeModal } = props;

  const {
    loading: verifiedEmailsQueryLoading,
    error: verifiedEmailsQueryError,
    data: verifiedEmailsQueryData
  } = useQuery<EngageVerifiedEmailsQueryResponse>(gql(engageQueries.verifiedEmails));

  const {
    loading: engagesConfigQueryLoading,
    error: engagesConfigQueryError,
    data: engagesConfigQueryData
  } = useQuery<EngageConfigQueryResponse>(gql(queries.engagesConfigDetail));

  const [engagesVerifyEmailMutation, { error: verifyEmailMutationError }] =
    useMutation(gql(engageMutations.verifyEmail), {
      refetchQueries: [{
        query: gql(engageQueries.verifiedEmails)
      }]
    });

  const [engagesRemoveVerifiedEmailMutation, { error: removeVerifiedEmailMutation }] =
    useMutation(gql(engageMutations.removeVerifiedEmail), {
      refetchQueries: [{
        query: gql(engageQueries.verifiedEmails)
      }]
    });

  const [engagesSendTestEmailMutation, { error: sendTestEmailMutation }] =
    useMutation(gql(engageMutations.sendTestEmail));

  if (verifiedEmailsQueryError || engagesConfigQueryError || verifyEmailMutationError || removeVerifiedEmailMutation || sendTestEmailMutation) {
    return <p>Error!</p>;
  }

  if (verifiedEmailsQueryLoading || engagesConfigQueryLoading) {
    return <p>Loading...</p>;
  }

  const renderButton = ({
    values,
    isSubmitted,
    callback
  }: IButtonMutateProps) => {
    return (
      <ButtonMutate
        mutation={engageMutations.configSave}
        variables={values}
        callback={callback}
        refetchQueries={'engagesConfigDetail'}
        isSubmitted={isSubmitted}
        type="submit"
        successMessage={`You successfully updated engages config`}
      />
    );
  };

  const verifyEmail = (email: string) => {
    engagesVerifyEmailMutation({
      variables: {
        email
      }
    })
      .then(() => {
        Alert.success(
          'Successfully sent verification email. Please check your inbox'
        );
      })

      .catch(e => {
        Alert.error(e.message);
      });
  };

  const removeVerifiedEmail = (email: string) => {
    confirm('You are about to remove verified email. Are your sure ?').then(
      () => {
        engagesRemoveVerifiedEmailMutation({
          variables: {
            email
          }
        })
          .then(() => {
            Alert.success('Successfully removed');
          })

          .catch(e => {
            Alert.error(e.message);
          });
      }
    );
  };

  const sendTestEmail = (from: string, to: string, content: string) => {
    engagesSendTestEmailMutation({
      variables: {
        from,
        to,
        content
      }
    })
      .then(() => {
        Alert.success('Successfully sent');
      })

      .catch(e => {
        Alert.error(e.message);
      });
  };

  return (
    <Settings
      renderButton={renderButton}
      verifyEmail={verifyEmail}
      sendTestEmail={sendTestEmail}
      removeVerifiedEmail={removeVerifiedEmail}
      closeModal={closeModal}
      engagesConfigDetail={engagesConfigQueryData ? engagesConfigQueryData.engagesConfigDetail : {} as IEngageConfig}
      verifiedEmails={verifiedEmailsQueryData ? verifiedEmailsQueryData.engageVerifiedEmails : []}
    />
  );
}

export default SettingsContainer;