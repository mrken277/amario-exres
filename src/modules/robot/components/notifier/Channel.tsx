import { IChannel } from 'modules/settings/channels/types';
import * as React from 'react';
import { Link } from 'react-router-dom';

type Props = {
  channel: IChannel;
  modalKey?: string;
};

function Channel(props: Props) {
  const { channel, modalKey } = props;
  const modal = modalKey && `#${modalKey}`;

  return (
    <Link to={`/settings/channels?_id=${channel._id}${modal}`}>
      {channel.name || 'Unknown'}
    </Link>
  );
}

export default Channel;
