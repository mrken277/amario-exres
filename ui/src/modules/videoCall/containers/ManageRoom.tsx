import client from 'apolloClient';
import gql from 'graphql-tag';
import { SmallLoader } from 'modules/common/components/ButtonMutate';
import Icon from 'modules/common/components/Icon';
import Tip from 'modules/common/components/Tip';
import { __, Alert } from 'modules/common/utils';
import { queries } from 'modules/inbox/graphql';
import React, { useState } from 'react';

type Props = {
  conversationId: string;
  refetch?: () => void;
};

function ManageRoom(props: Props) {
  const [loading, setLoading] = useState(false);

  const openWindow = (url, name: string, token: string) => {
    const height = 600;
    const width = 480;

    const y = window.top.outerHeight / 2 + window.top.screenY - height / 2;
    const x = window.top.outerWidth / 2 + window.top.screenX - width / 2;

    window.open(
      `/videoCall?url=${url}&name=${name}&t=${token}`,
      '_blank',
      `toolbar=no,titlebar=no,directories=no,menubar=no,location=no,scrollbars=yes,status=no,height=${height},width=${width},top=${y},left=${x}`
    );
  };

  const createVideoRoom = () => {
    const { conversationId, refetch } = props;

    setLoading(true);
    client
      .query({
        query: gql(queries.getVideoRoom),
        variables: {
          _id: conversationId
        },
        fetchPolicy: 'network-only'
      })
      .then(({ data }: any) => {
        const {
          url,
          name,
          created,
          ownerToken
        } = data.conversationsGetVideoRoom;

        if (created) {
          if(refetch) {
            refetch();
          }
        }

        openWindow(url, name, ownerToken);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);

        Alert.error(error.message);
      });
  };

  return (
    <Tip text={__('Invite to video call')}>
      <label onClick={createVideoRoom}>
        {loading ? <SmallLoader /> : <Icon icon="video" />}
      </label>
    </Tip>
  );
}

export default ManageRoom;
