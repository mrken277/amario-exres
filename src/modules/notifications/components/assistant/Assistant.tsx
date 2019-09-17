import { colors } from 'modules/common/styles';
import { Popover } from 'modules/common/styles/main';
import * as React from 'react';
import { OverlayTrigger } from 'react-bootstrap';
import NotifierItem from '../NotiferItem';
import { PopoverContent } from '../styles';
import ActionGroup from './ActionGroup';
import { Bot } from './styles';

class Assistant extends React.Component<{}> {
  constructor(props) {
    super(props);

    this.update = this.update.bind(this);
  }

  update() {
    // rerender component
    this.forceUpdate();
  }

  renderPopoverContent() {
    return (
      <PopoverContent>
        <ActionGroup label="Customer auto merge" />
        <ActionGroup
          label="Company log, meta description"
          color={colors.colorCoreGreen}
        />
        <NotifierItem>
          <span role="img" aria-label="Wave">
            👋
          </span>
          <div>
            <h3>Hello Ganzorig</h3>
            <p>
              Hello I'm erxes. Make sure <a href="#test">save your profile</a>{' '}
              information
            </p>
          </div>
        </NotifierItem>
      </PopoverContent>
    );
  }

  render() {
    const content = <Popover>{this.renderPopoverContent()}</Popover>;

    return (
      <OverlayTrigger
        trigger="click"
        rootClose={true}
        placement="top"
        containerPadding={15}
        overlay={content}
        shouldUpdatePosition={true}
      >
        <Bot>
          <img src="/images/erxes-bot.svg" alt="ai robot" />
        </Bot>
      </OverlayTrigger>
    );
  }
}

export default Assistant;
