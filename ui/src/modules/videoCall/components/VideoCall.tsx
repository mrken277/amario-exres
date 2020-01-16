import DailyIframe from '@daily-co/daily-js';
import React from 'react';

type Props = {
  queryParams: any;
};

class VideoCall extends React.Component<Props> {
  private callFrame;

  componentDidMount() {
    const { url } = this.props.queryParams;

    if (!url) {
      return;
    }

    const owner = { url };

    this.callFrame = DailyIframe.createFrame(
      document.getElementById('call-frame-container'),
      {}
    );

    this.callFrame.join(owner);
  }

  onLeave = () => {
    this.callFrame.leave();

    window.close();
  };

  render() {
    const { url } = this.props.queryParams;

    return (
      <>
        {url ? <span onClick={this.onLeave}>Leave</span> : 'No room'}
        <div
          id="call-frame-container"
          style={{ width: '100%', height: '500px' }}
        />
      </>
    );
  }
}

export default VideoCall;
