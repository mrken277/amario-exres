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

class CreateRoom extends React.Component<FinalProps> {
  createVideoRoom = () => {
    const {
      conversationId
      // callback,
      // createVideoChatRoomMutation,
    } = this.props;

    const REACT_DAILY_END_POINT = 'https://erxes-inc.daily.co';

    client
      .query({
        query: gql(queries.getVideoRoom),
        variables: {
          _id: conversationId
        }
      })
      .then(({ data }: any) => {
        const name = data.conversationsGetVideoRoom;

        if (name) {
          window.open(
            `/videoCall?url=${REACT_DAILY_END_POINT}/${name}`,
            '_blank',
            'location=yes,height=570,width=520,scrollbars=yes,status=yes'
          );

          return;
        }

        return null;
      })
      .catch(error => {
        Alert.error(error.message);
      });

    // createVideoChatRoomMutation({ variables: { conversationId } }).then(
    //   ({ data }) => {
    //     const createdUrl = data.conversationCreateVideoChatRoom.url;

    //     const anchor = `<a href="${createdUrl}">Join a call</a>`;

    //     callback(anchor);

    //     window.open(
    //       `/videoCall?url=${createdUrl}`,
    //       '_blank',
    //       'location=yes,height=570,width=520,scrollbars=yes,status=yes'
    //     );
    //   }
    // );

    return;
  };

  render() {
    console.log('conversationId: ', this.props.conversationId);

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
  )(CreateRoom)
);
