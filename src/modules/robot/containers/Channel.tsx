import gql from 'graphql-tag';
import { withProps } from 'modules/common/utils';
import { ChannelDetailQueryResponse } from 'modules/settings/channels/types';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import Channel from '../components/notifier/Channel';
import { queries } from '../graphql';

type Props = {
  id: string;
  modalKey?: string;
};

type FinalProps = {
  channelDetailQuery: ChannelDetailQueryResponse;
} & Props;

class ChannelContainer extends React.Component<FinalProps> {
  render() {
    const { channelDetailQuery } = this.props;

    const channel = channelDetailQuery.channelDetail || {};

    if (channelDetailQuery.loading) {
      return null;
    }

    const updatedProps = {
      ...this.props,
      channel
    };

    return <Channel {...updatedProps} />;
  }
}

export default withProps<Props>(
  compose(
    graphql<Props>(gql(queries.channelDetail), {
      options: ({ id }) => ({
        variables: { _id: id }
      }),
      name: 'channelDetailQuery'
    })
  )(ChannelContainer)
);
