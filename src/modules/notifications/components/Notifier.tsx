import * as React from 'react';
import styled from 'styled-components';
import NotifierItem from './NotiferItem';

const NotifierContainer = styled.div`
  position: fixed;
  bottom: 65px;
  left: 15px;
`;

class Notifier extends React.Component<{}> {
  renderNotifications() {
    return (
      <>
        <NotifierItem delay={3000}>
          <div>Content</div>
        </NotifierItem>
        <NotifierItem>
          <div>Content</div>
        </NotifierItem>
      </>
    );
  }

  render() {
    return <NotifierContainer>{this.renderNotifications()}</NotifierContainer>;
  }
}

export default Notifier;
