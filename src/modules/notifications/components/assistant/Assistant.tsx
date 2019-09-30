import { colors } from 'modules/common/styles';
import ModulItem from 'modules/robot/components/ModulItem';
import { Greeting, ModulRow } from 'modules/robot/components/styles';
import * as React from 'react';
import { OverlayTrigger } from 'react-bootstrap';
import { PopoverContent } from '../styles';
import ActionGroup from './ActionGroup';
import { Bot, PopoverHome } from './styles';

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
        <Greeting>
          Good morning! <b>Ganzorig 👋</b>
          <br /> What module do you use usually?
        </Greeting>
        <ModulRow>
          <ModulItem
            title="Team Inbox"
            description="Combine client and team"
            color="#ec542b"
          />
          <ModulItem
            title="Growth Hack"
            description="Combine client and team"
            color="#3599cb"
            icon="idea"
          />
        </ModulRow>
        <ModulRow>
          <ModulItem
            title="Team Inbox"
            description="Combine client and team"
            color="#27b553"
          />
          <ModulItem
            title="Growth Hack"
            description="Combine client and team"
            color="#de59b2"
            icon="idea"
          />
        </ModulRow>
        <ActionGroup
          label="Company log, meta description"
          color={colors.colorCoreGreen}
        />
      </PopoverContent>
    );
  }

  render() {
    const content = <PopoverHome>{this.renderPopoverContent()}</PopoverHome>;

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
