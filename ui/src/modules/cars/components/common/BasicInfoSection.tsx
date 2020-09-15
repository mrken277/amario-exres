import Sidebar from 'modules/layout/components/Sidebar';
import React from 'react';
import { ICar } from '../../types';
import DetailInfo from './DetailInfo';
import { __, Alert, confirm } from 'modules/common/utils';
import { InfoWrapper } from 'modules/common/styles/main';
import { Name, Action } from 'modules/customers/styles';
import ModalTrigger from 'modules/common/components/ModalTrigger';
import Icon from 'modules/common/components/Icon';
import DropdownToggle from 'modules/common/components/DropdownToggle';
import CarForm from 'modules/cars/containers/CarForm';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'modules/common/components/Button';

type Props = {
  car: ICar;
  remove: () => void;
};

class BasicInfoSection extends React.Component<Props> {
  renderAction() {
    const { remove } = this.props;

    const onDelete = () =>
      confirm()
        .then(() => remove())
        .catch(error => {
          Alert.error(error.message);
        });

    return (
      <Action>
        <Dropdown>
          <Dropdown.Toggle as={DropdownToggle} id="dropdown-info">
            <Button btnStyle="simple" size="medium">
              {__('Action')}
              <Icon icon="angle-down" />
            </Button>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <li>
              <a href="#delete" onClick={onDelete}>
                {__('Delete')}
              </a>
            </li>
          </Dropdown.Menu>
        </Dropdown>
      </Action>
    );
  }

  render() {
    const { Section } = Sidebar;
    const { car } = this.props;

    const content = props => <CarForm {...props} car={car} />;

    return (
      <Sidebar.Section>
        <InfoWrapper>
          <Name>{car.plateNumber}</Name>
          <ModalTrigger
            title="Edit basic info"
            trigger={<Icon icon="edit" />}
            size="lg"
            content={content}
          />
        </InfoWrapper>

        {this.renderAction()}

        <Section>
          <DetailInfo car={car} />
        </Section>
      </Sidebar.Section>
    );
  }
}

export default BasicInfoSection;
