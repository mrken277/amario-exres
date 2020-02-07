import { useMutation, useQuery } from '@apollo/react-hooks';
import { AppConsumer } from 'appContext';
import gql from 'graphql-tag';
import { queries } from 'modules/auth/graphql';
import { IUser } from 'modules/auth/types';
import { Alert } from 'modules/common/utils';
import { queries as teamQueries } from 'modules/settings/team/graphql';
import { UserDetailQueryResponse } from 'modules/settings/team/types';
import React from 'react';
import { queries as brandQueries } from '../../brands/graphql';
import { BrandsQueryResponse } from '../../brands/types';
import Signature from '../components/Signature';
import {
  IEmailSignature,
  IEmailSignatureWithBrand,
  UsersConfigEmailSignaturesMutationResponse,
  UsersConfigEmailSignaturesMutationVariables
} from '../types';

type Props = {
  currentUser: IUser;
  closeModal: () => void;
};

export const SignatureContainer = (props: Props) => {
  const { currentUser } = props;

  const {
    loading: brandsQueryLoading,
    error: brandsQueryError,
    data: brandsQueryData
  } = useQuery<BrandsQueryResponse, {}>(gql(brandQueries.brands));

  const {
    loading: userDetailQueryLoading,
    error: userDetailQueryError,
    data: userDetailQueryData
  } = useQuery<UserDetailQueryResponse, { _id: string }>(
    gql(teamQueries.userDetail),
    { variables: { _id: currentUser._id } }
  );

  const [saveMutation, { error: usersConfigError }] =
    useMutation<UsersConfigEmailSignaturesMutationResponse, UsersConfigEmailSignaturesMutationVariables>(
      gql`
      mutation usersConfigEmailSignatures($signatures: [EmailSignature]) {
        usersConfigEmailSignatures(signatures: $signatures) {
          _id
        }
      }
    `, {
      refetchQueries: [{
        query: gql(queries.currentUser)
      }, {
        query: gql(teamQueries.userDetail),
        variables: { _id: currentUser._id }
      }]
    });
  // save email configs action
  const save = (signaturesToSave: IEmailSignatureWithBrand[], callback) => {
    const doc: IEmailSignature[] = [];

    // remove brandName from list
    signaturesToSave.forEach(item => {
      if (item.signature) {
        doc.push({
          brandId: item.brandId,
          signature: item.signature
        });
      }
    });

    saveMutation({ variables: { signatures: doc } })
      .then(() => {
        Alert.success('Great job! You just set up your email signature.');
        callback();
      })
      .catch(error => {
        Alert.success(error.message);
      });
  };

  const user = userDetailQueryData ? userDetailQueryData.userDetail : {} as IUser;
  const emailSignatures = user.emailSignatures || [];
  const signatures: IEmailSignatureWithBrand[] = [];
  const brands = brandsQueryData ? brandsQueryData.brands : [];

  brands.forEach(brand => {
    // previously configured signature
    const oldEntry = emailSignatures.find(
      signature => signature.brandId === brand._id
    );

    signatures.push({
      brandId: brand._id,
      brandName: brand.name || '',
      signature: oldEntry ? oldEntry.signature : ''
    });
  });

  if (brandsQueryError || userDetailQueryError || usersConfigError) {
    return <p>Error!</p>;
  }

  if (brandsQueryLoading || userDetailQueryLoading) {
    return <p>Loading...</p>;
  }

  const updatedProps = {
    ...props,
    signatures,
    save
  };

  return <Signature {...updatedProps} />;
};

const WithConsumer = props => {
  return (
    <AppConsumer>
      {({ currentUser }) => <SignatureContainer {...props} currentUser={currentUser} />}
    </AppConsumer>
  );
};

export default WithConsumer;
