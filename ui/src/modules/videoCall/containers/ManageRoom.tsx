import client from 'apolloClient';
import gql from 'graphql-tag';
import * as compose from 'lodash.flowright';
import Icon from 'modules/common/components/Icon';
import { Alert, withProps } from 'modules/common/utils';
import { queries } from 'modules/inbox/graphql';
import React from 'react';
import { graphql } from 'react-apollo';
import { mutations } from '../graphql';

type Props = {
  conversationId: string;
  callback: (content: string) => void;
};

type FinalProps = {
  createVideoChatRoomMutation: any;
  getVideoRoomQuery: any;
} & Props;

class ManageRoom extends React.Component<FinalProps> {
  createVideoRoom = () => {
    const {
      conversationId,
      callback,
      createVideoChatRoomMutation
    } = this.props;

    client
      .query({
        query: gql(queries.getVideoRoom),
        variables: {
          _id: conversationId
        },
        fetchPolicy: 'network-only'
      })
      .then(({ data }: any) => {
        const name = data.conversationsGetVideoRoom;

        if (name) {
          window.open(
            `/videoCall?name=${name}`,
            '_blank',
            'location=yes,height=570,width=520,scrollbars=yes,status=yes'
          );

          return;
        }

        createVideoChatRoomMutation({ variables: { conversationId } }).then(
          ({ data: { conversationCreateVideoChatRoom } }) => {
            const REACT_DAILY_END_POINT = 'https://erxes-inc.daily.co';

            const createdName = conversationCreateVideoChatRoom.name;

            const anchor = `<a href="${REACT_DAILY_END_POINT}/${createdName}">Join a call</a>`;

            callback(anchor);

            window.open(
              `/videoCall?name=${createdName}`,
              '_blank',
              'location=yes,height=570,width=520,scrollbars=yes,status=yes'
            );
          }
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

export default withProps<Props>(
  compose(
    graphql<Props>(gql(mutations.createVideoChatRoom), {
      name: 'createVideoChatRoomMutation'
    })
  )(ManageRoom)
);
