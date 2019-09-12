import { Popover } from 'modules/common/styles/main';
import * as React from 'react';
import { OverlayTrigger } from 'react-bootstrap';
import { Bot, PopoverContent } from './styles';

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
        <div>qweqwqweqwe</div>
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
