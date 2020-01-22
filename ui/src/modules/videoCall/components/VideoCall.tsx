import DailyIframe from '@daily-co/daily-js';
import client from 'apolloClient';
import gql from 'graphql-tag';
import { Alert } from 'modules/common/utils';
import React from 'react';
import { mutations } from '../graphql';

type Props = {
  queryParams: any;
};

class VideoCall extends React.Component<Props, { errorMessage: string }> {
  private callFrame;

  constructor(props) {
    super(props);

    this.state = { errorMessage: '' };
  }

  componentDidMount() {
    const REACT_DAILY_END_POINT = 'https://erxes-inc.daily.co';
    const { name, t } = this.props.queryParams;

    if (!name || !t) {
      return;
    }

    const owner = { url: `${REACT_DAILY_END_POINT}/${name}?t=${t}` };

    this.callFrame = DailyIframe.createFrame(
      document.getElementById('call-frame-container'),
      {}
    );

    this.callFrame.on('error', e => {
      this.setState({ errorMessage: e.errorMsg });
    });

    this.callFrame.join(owner);
  }

  onDelete = () => {
    client
      .mutate({
        mutation: gql(mutations.deleteVideoChatRoom),
        variables: {
          name: this.props.queryParams.name
        }
      })
      .then(({ data: { conversationDeleteVideoChatRoom: { deleted } } }) => {
        if (deleted) {
          Alert.success('Амжилттай устгалаа');

          window.close();
        }
      })
      .catch(error => {
        Alert.error(error.message);
      });
  };

  renderControls() {
    const { name } = this.props.queryParams;

    if (!name) {
      return 'No room';
    }

    return <span onClick={this.onDelete}>Delete room</span>;
  }

  render() {
    return (
      <>
        {this.renderControls()}
        {this.state.errorMessage}
        <div
          id="call-frame-container"
          style={{ width: '100%', height: '500px' }}
        />
      </>
    );
  }
}

export default VideoCall;
