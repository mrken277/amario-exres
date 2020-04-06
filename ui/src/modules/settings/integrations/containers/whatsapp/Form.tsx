import { IButtonMutateProps, IRouterProps } from 'modules/common/types';
import { mutations, queries } from 'modules/settings/integrations/graphql';

import client from 'apolloClient';
import gql from 'graphql-tag';
import ButtonMutate from 'modules/common/components/ButtonMutate';
import { Alert } from 'modules/common/utils';
import Whatsapp from 'modules/settings/integrations/components/whatsapp/Whatsapp';
import React from 'react';
import { withRouter } from 'react-router-dom';

type Props = {
  type?: string;
  closeModal: () => void;
};

type State = {
  qrCode: string;
  loading: boolean;
};

type FinalProps = {} & IRouterProps & Props;

class WhatsappContainer extends React.Component<FinalProps, State> {
  constructor(props: FinalProps) {
    super(props);

    this.state = { qrCode: '', loading: false };
  }

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
        isSubmitted={isSubmitted}
        type="submit"
        successMessage={`You successfully added a ${name}`}
      />
    );
  };

  onSave = (integration?) => {
    this.setState({ loading: true });

    if (!integration) {
      this.setState({ loading: false });
      return this.setState({ qrCode: '' });
    }

    const id = integration.integrationsCreateExternalIntegration._id;

    client
      .query({
        query: gql(queries.whatsAppQrCode),
        variables: {
          id
        }
      })
      .then(({ data, loading }: any) => {
        if (!loading) {
          this.setState({
            qrCode: data.integrationGetWhatsAppQrCode,
            loading
          });
        }
      })
      .catch(error => {
        this.setState({ loading: false });
        Alert.error(error.message);
      });
  };

  render() {
    const { closeModal } = this.props;
    const { qrCode, loading } = this.state;

    const updatedProps = {
      closeModal,
      qrCode,
      loading,
      onSave: this.onSave,
      renderButton: this.renderButton
    };

    return <Whatsapp {...updatedProps} />;
  }
}

export default withRouter<FinalProps>(WhatsappContainer);
