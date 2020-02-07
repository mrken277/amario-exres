import ButtonMutate from 'modules/common/components/ButtonMutate';
import { IButtonMutateProps } from 'modules/common/types';
import Chatfuel from 'modules/settings/integrations/components/chatfuel/Form';
import { mutations } from 'modules/settings/integrations/graphql';
import React from 'react';

type Props = {
  type?: string;
  closeModal: () => void;
};

class ChatfuelContainer extends React.Component<Props> {
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

  render() {
    const { closeModal } = this.props;

    const updatedProps = {
      closeModal,
      renderButton: this.renderButton
    };

    return <Chatfuel {...updatedProps} />;
  }
}

export default ChatfuelContainer;
