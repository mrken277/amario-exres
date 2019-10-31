import { IChannel } from 'modules/settings/channels/types';
import * as React from 'react';
import { Link } from 'react-router-dom';

type Props = {
  channel: IChannel;
  modalKey?: string;
};

class Channel extends React.PureComponent<Props> {
  render() {
    const { channel, modalKey } = this.props;
    const modal = modalKey && `#${modalKey}`;

    return (
      <Link to={`/settings/channels?_id=${channel._id}${modal}`}>
        {channel.name || 'Unknown'}
      </Link>
    );
  }
}

export default Channel;
