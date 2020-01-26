import Button from 'modules/common/components/Button';
import Icon from 'modules/common/components/Icon';
import { __ } from 'modules/common/utils';
import React from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { ISegmentCondition } from '../../types';
import { FieldType, PopoverList } from '../styles';

type Props = {
  addCondition: (condition: ISegmentCondition) => void;
};

class AddConditionButton extends React.Component<Props> {
  private overlayTrigger;

  addPropertyCondition = () => {
    this.props.addCondition({
      key: Math.random().toString(),
      type: 'property',
      propertyName: '',
      propertyValue: '',
      propertyOperator: '',
    });

    this.overlayTrigger.hide();
  };

  addEventCondition = () => {
    this.props.addCondition({
      key: Math.random().toString(),
      type: 'event',
      eventAttributeFilters: [],
    });

    this.overlayTrigger.hide();
  };

  renderPopover() {
    return (
      <Popover id="condition-popover">
        <Popover.Title as="h3">{__('Select a field')}</Popover.Title>
        <Popover.Content>
          <PopoverList onClick={this.addPropertyCondition}>
            <FieldType>
              {__("Properties")}
              <Icon icon="information" />
            </FieldType>
          </PopoverList>

          <PopoverList onClick={this.addEventCondition}>
            <FieldType>
              {__("Events")}
              <Icon icon="settings-3" />
            </FieldType>
          </PopoverList>
        </Popover.Content>
      </Popover>
    );
  }

  render() {
    return (
      <OverlayTrigger
        ref={overlayTrigger => {
          this.overlayTrigger = overlayTrigger;
        }}
        trigger="click"
        placement="bottom"
        overlay={this.renderPopover()}
        container={this}
        rootClose={true}
      >
        <Button btnStyle="success" icon="add">
          Add a condition
        </Button>
      </OverlayTrigger>
    );
  }
}

export default AddConditionButton;