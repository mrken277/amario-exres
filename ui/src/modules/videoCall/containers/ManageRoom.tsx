import client from 'apolloClient';
import gql from 'graphql-tag';
import Icon from 'modules/common/components/Icon';
import { Alert } from 'modules/common/utils';
import { queries } from 'modules/inbox/graphql';
import React from 'react';

type Props = {
  conversationId: string;
  callback: (content: string) => void;
};

class ManageRoom extends React.Component<Props> {
  createVideoRoom = () => {
    const { conversationId, callback } = this.props;

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
          name,
          created,
          token,
          ownerToken
        } = data.conversationsGetVideoRoom;

        if (created) {
          const REACT_DAILY_END_POINT = 'https://erxes-inc.daily.co';

          const anchor = `<a href="${REACT_DAILY_END_POINT}/${name}?t=${token}">Join a call</a>`;

          callback(anchor);
        }

        window.open(
          `/videoCall?name=${name}&t=${ownerToken}`,
          '_blank',
          'location=yes,height=570,width=520,scrollbars=yes,status=yes'
        );
      })
      .catch(error => {
        Alert.error(error.message);
      });
  };

  render() {
    return (
      <label onClick={this.createVideoRoom}>
        <Icon icon="video" />
      </label>
    );
  }
}

export default ManageRoom;
