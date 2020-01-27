import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import ModalTrigger from 'modules/common/components/ModalTrigger';
import { Alert } from 'modules/common/utils';
import ManageIntegrations from 'modules/settings/integrations/containers/common/ManageIntegrations';
import { integrationsListParams } from 'modules/settings/integrations/containers/utils';
import { queries as integQueries } from 'modules/settings/integrations/graphql';
import { IIntegration } from 'modules/settings/integrations/types';
import React from 'react';
import { mutations, queries } from '../graphql';
import { BrandsManageIntegrationsMutationResponse, IBrandDoc } from '../types';
import ChooseBrand from './ChooseBrand';

type Props = {
  currentBrand: IBrandDoc;
  queryParams: any;
};

const ManageIntegrationsContainer = (props: Props) => {
  const { currentBrand, queryParams } = props;

  const [saveMutation, { error: brandManageIntegrationsError }] =
    useMutation<BrandsManageIntegrationsMutationResponse, {}>(
      gql(mutations.brandManageIntegrations), {
      refetchQueries: [
        {
          query: gql(integQueries.integrations),
          variables: {
            brandId: currentBrand._id,
            ...integrationsListParams(queryParams)
          }
        },
        {
          query: gql(queries.brandDetail),
          variables: { _id: currentBrand._id }
        },
        {
          query: gql(queries.integrationsCount),
          variables: { brandId: currentBrand._id }
        }
      ]
    });

  const renderConfirm = (integration: IIntegration, actionTrigger, icon, handleChange) => {
    if (icon === 'add') {
      return null;
    }

    const onSave = () => handleChange(icon, integration);

    const content = modalProps => (
      <ChooseBrand {...modalProps} integration={integration} onSave={onSave} />
    );

    return (
      <ModalTrigger
        key={integration._id}
        title="Choose new brand"
        trigger={actionTrigger}
        content={content}
      />
    );
  }

  const save = (integrationIds: string[]): Promise<any> => {
    return saveMutation({
      variables: {
        _id: currentBrand._id,
        integrationIds
      }
    })
      .then(() => {
        Alert.success('You successfully managed an integration');
      })
      .catch(e => {
        Alert.error(e.message);
      });
  };

  if (brandManageIntegrationsError) {
    return <p>Error!</p>;
  }

  const updatedProps = {
    ...props,
    current: currentBrand,
    save,
    renderConfirm
  };

  return <ManageIntegrations {...updatedProps} />;
}

export default ManageIntegrationsContainer;