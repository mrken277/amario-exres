import DailyIframe from '@daily-co/daily-js';
import client from 'apolloClient';
import gql from 'graphql-tag';
import { SimpleButton } from 'modules/common/styles/main';
import { Alert } from 'modules/common/utils';
import React from 'react';
import styled from 'styled-components';
import styledTS from 'styled-components-ts';
import { REACT_DAILY_END_POINT } from '../constants';
import { mutations } from '../graphql';

const Control = styledTS<{ disabled?: boolean; }>(
  styled(SimpleButton)
)`
  width: auto;
  height: auto;
  position: absolute;
  right: 3px;
  padding: 0 10px;
  font-size: 13px;
  background: #fafafa;
  top: 3px;
  pointer-events: ${props => props.disabled && 'none'};
  opacity: ${props => props.disabled && '0.9'};
`;

const Error = styled.div`
  position: absolute;
  height: 30px;
  width: 100%;
  color: #721c24;
  background-color: #f8d7da;
  line-height: 28px;
  text-align: center;
  border: 1px solid #f5c6cb;
`;

type Props = {
  queryParams: any;
};

class VideoCall extends React.Component<Props, { loading:boolean, errorMessage: string }> {
  private callFrame;

  constructor(props) {
    super(props);

    this.state = { errorMessage: '', loading: false };
  }

  componentDidMount() {
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
    this.setState({ loading: true });
    client
      .mutate({
        mutation: gql(mutations.deleteVideoChatRoom),
        variables: {
          name: this.props.queryParams.name
        }
      })
      .then(({ data: { conversationDeleteVideoChatRoom: { deleted } } }) => {
        if (deleted) {
          window.close();
          this.setState({ loading: false });
        }
      })
      .catch(error => {
        Alert.error(error.message);
      });
  };

  renderControls() {
    const { name } = this.props.queryParams;

    if (!name) {
      return;
    }

    return (
      <Control onClick={this.onDelete} disabled={this.state.loading}>
        {this.state.loading ? 'Please wait...' : 'Delete room'} 
      </Control>
    );
  }

  render() {
    return (
      <>
        {this.renderControls()}
        {this.state.errorMessage && <Error>{this.state.errorMessage}</Error>}
        <div
          id="call-frame-container"
          style={{ width: '100%', height: '100%' }}
        />
      </>
    );
  }
}

export default VideoCall;
