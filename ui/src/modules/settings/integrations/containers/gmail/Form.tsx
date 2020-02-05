import client from 'apolloClient';
import gql from 'graphql-tag';
import ButtonMutate from 'modules/common/components/ButtonMutate';
import { IButtonMutateProps } from 'modules/common/types';
import { Alert } from 'modules/common/utils';
import Gmail from 'modules/settings/integrations/components/gmail/Form';
import { mutations, queries } from 'modules/settings/integrations/graphql';
import * as React from 'react';
import { getRefetchQueries } from '../utils';

type Props = {
  type?: string;
  closeModal: () => void;
};

type State = {
  email: string;
  accountId: string;
};

class GmailContainer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = { email: '', accountId: '' };
  }

  onAccountSelect = (accountId?: string) => {
    if (!accountId) {
      return this.setState({ email: '', accountId: '' });
    }

    client
      .query({
        query: gql(queries.fetchApi),
        variables: {
          path: '/gmail/get-email',
          params: { accountId }
        }
      })
      .then(({ data, loading }: any) => {
        if (!loading) {
          this.setState({
            email: data.integrationsFetchApi,
            accountId
          });
        }
      })
      .catch(error => {
        Alert.error(error.message);
      });
  };

  onRemoveAccount = () => {
    this.setState({ email: '' });
  };

  renderButton = ({
    name,
    values,
    isSubmitted,
    callback
  }: IButtonMutateProps) => {
    return (
      <ButtonMutate
        mutation={mutations.integrationsCreateExternalIntegration}
        variables={values}
        callback={callback}
        refetchQueries={getRefetchQueries('gmail')}
        isSubmitted={isSubmitted}
        type="submit"
        successMessage={`You successfully added a ${name}`}
      />
    );
  };

  render() {
    const { closeModal } = this.props;
    const { accountId, email } = this.state;

    const updatedProps = {
      closeModal,
      accountId,
      email,
      onAccountSelect: this.onAccountSelect,
      onRemoveAccount: this.onRemoveAccount,
      renderButton: this.renderButton
    };

    return <Gmail {...updatedProps} />;
  }
}

export default GmailContainer;
