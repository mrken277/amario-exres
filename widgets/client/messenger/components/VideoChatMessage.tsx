import * as React from "react";
import * as xss from "xss";
import { __ } from "../../utils";

type Props = {
  content: string;
};

class VideoChatMessage extends React.PureComponent<Props> {
  getUrl = () => {
    let url = "";

    // exract url from invitation message
    this.props.content.replace(/href=("|')(.*?)("|')/g, (a, b, match) => {
      url = match;
      return match;
    });

    return url;
  };

  joinVideoCall = () => {
    const iframeId = "erxes-video-iframe";

    // container
    const videoChatContainer = document.createElement("div");
    videoChatContainer.id = "erxes-video-container";

    // add iframe
    const iframe = document.createElement("iframe");
    iframe.id = iframeId;
    iframe.src = this.getUrl();

    videoChatContainer.appendChild(iframe);
    const widgetRoot = document.getElementById("page-root");

    if (widgetRoot) {
      widgetRoot.appendChild(videoChatContainer);
    }
  };

  render() {
    const { content } = this.props;

    return (
      <div className="app-message-box spaced">
        <div className="user-info">
          <h4>{__("You are invited to a video chat")}</h4>
          <h2>
            <span role="img" aria-label="Wave">
              👏
            </span>
          </h2>
        </div>
        <div className="call-button">
          <button onClick={this.joinVideoCall}>{__("Join a call")}</button>
          <div className="join-call">
            ({__("or click to")}
            <span dangerouslySetInnerHTML={{ __html: xss(content) }} />{" "}
            {__("in new tab")})
          </div>
        </div>
      </div>
    );
  }
}

export default VideoChatMessage;
