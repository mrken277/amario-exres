import { ActionList } from 'modules/boards/styles/stage';
import React, { Component } from 'react';
import { Popover } from 'react-bootstrap';

type Props = {
  closePopover: () => void;
};

class StagePopover extends Component<Props> {
  render() {
    const { closePopover } = this.props;

    const archiveList = () => {
      console.log('archive list');
      closePopover();
    };

    const archiveItems = () => {
      console.log('archive items');
      closePopover();
    };

    return (
      <Popover id="stage-popover">
        <ActionList>
          <li onClick={archiveList} key="archive-items">
            Archive All Cards in This List
          </li>
          <li onClick={archiveItems} key="archive-list">
            Archive This List
          </li>
        </ActionList>
      </Popover>
    );
  }
}

export default StagePopover;
