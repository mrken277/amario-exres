import Button from 'modules/common/components/Button';
import Icon from 'modules/common/components/Icon';
import { __ } from 'modules/common/utils';
import React from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { ISegmentCondition, ISegmentField } from '../../types';
import { FieldType, PopoverList } from '../styles';

type Props = {
  fields: ISegmentField[];
  events: string[];
  addCondition: (condition: ISegmentCondition) => void;
};

class AddConditionButton extends React.Component<Props> {
  private overlayTrigger;

  addCondition = (type: string) => {
    this.props.addCondition({
      key: Math.random().toString(),
      propertyName: '',
      propertyValue: '',
      propertyOperator: '',
      type,
    });

    this.overlayTrigger.hide();
  };

  renderPopover() {
    const addPropertyCondition = () => {
      return this.addCondition('property');
    }

    const addEventCondition = () => {
      return this.addCondition('event');
    }

    return (
      <Popover id="condition-popover">
        <Popover.Title as="h3">{__('Select a field')}</Popover.Title>
        <Popover.Content>
          <PopoverList onClick={addPropertyCondition}>
            <FieldType>
              {__("Fields")}
              <Icon icon="information" />
            </FieldType>
          </PopoverList>

          <PopoverList onClick={addEventCondition}>
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
