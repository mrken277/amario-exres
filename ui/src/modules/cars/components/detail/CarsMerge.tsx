import { CAR_DATAS, CAR_INFO } from 'modules/cars/constants';
import Button from 'modules/common/components/Button';
import Icon from 'modules/common/components/Icon';
import { Column, Columns, Title } from 'modules/common/styles/chooser';
import { ModalFooter } from 'modules/common/styles/main';
import {
  Info,
  InfoAvatar,
  InfoDetail,
  InfoTitle
} from 'modules/customers/styles';
import React from 'react';
import { ICar } from '../../types';

type Props = {
  objects: ICar[];
  save: (
    doc: {
      ids: string[];
      data: any;
      callback: () => void;
    }
  ) => void;
  closeModal: () => void;
};

type State = {
  selectedValues: any;
};

class CarsMerge extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      selectedValues: {}
    };
  }

  save = e => {
    e.preventDefault();
    const { objects } = this.props;
    const selectedValues = { ...this.state.selectedValues };
    const owner = selectedValues.owner;
    const parentCar = selectedValues.parentCar;

    if (owner) {
      selectedValues.ownerId = owner._id;

      delete selectedValues.owner;
    }

    if (parentCar) {
      selectedValues.parentCarId = parentCar._id;

      delete selectedValues.parentCar;
    }

    this.props.save({
      ids: objects.map(car => car._id),
      data: { ...selectedValues },
      callback: () => {
        this.props.closeModal();
      }
    });
  };

  handleChange = (type, key, value) => {
    const selectedValues = { ...this.state.selectedValues };

    if (type === 'plus-1') {
      selectedValues[key] = value;

      if (key === 'links') {
        const links = Object.assign(
          { ...this.state.selectedValues.links },
          value
        );
        selectedValues[key] = links;
      }
    } else {
      delete selectedValues[key];
    }

    this.setState({ selectedValues });
  };

  renderCar = (car, icon) => {
    const properties = CAR_INFO.ALL.concat(CAR_DATAS.ALL);

    return (
      <React.Fragment>
        <Title>{car.primaryName || car.website}</Title>
        <ul>
          {properties.map(info => {
            const key = info.field;

            if (!car[key]) {
              return null;
            }

            return this.renderCarProperties(key, car[key], icon);
          })}
        </ul>
      </React.Fragment>
    );
  };

  renderCarProperties(key, value, icon) {
    return (
      <li key={key} onClick={this.handleChange.bind(this, icon, key, value)}>
        {this.renderTitle(key)}
        {this.renderValue(key, value)}

        <Icon icon={icon} />
      </li>
    );
  }

  renderTitle(key) {
    const title = CAR_INFO[key] || CAR_DATAS[key];

    return <InfoTitle>{title}:</InfoTitle>;
  }

  renderValue = (field, value) => {
    switch (field) {
      case 'owner':
        return this.renderOwner(value);
      case 'parentCar':
        return this.renderParentCar(value);
      case 'avatar':
        return <InfoAvatar src={value} alt="avatar" />;

      default:
        return <InfoDetail>{value}</InfoDetail>;
    }
  };

  renderOwner(data) {
    return (
      <Info>
        <InfoTitle>Name: </InfoTitle>
        <InfoDetail>{data.details.fullName}</InfoDetail>
      </Info>
    );
  }

  renderParentCar(data) {
    return (
      <Info>
        <InfoTitle>Name: </InfoTitle>
        <InfoDetail>{data.primaryName}</InfoDetail>
      </Info>
    );
  }

  render() {
    const { selectedValues } = this.state;
    const { objects, closeModal } = this.props;
    const [car1, car2] = objects;

    return (
      <form onSubmit={this.save}>
        <Columns>
          <Column className="multiple">{this.renderCar(car1, 'plus-1')}</Column>

          <Column className="multiple">{this.renderCar(car2, 'plus-1')}</Column>

          <Column>{this.renderCar(selectedValues, 'times')}</Column>
        </Columns>

        <ModalFooter>
          <Button btnStyle="simple" onClick={closeModal} icon="cancel-1">
            Cancel
          </Button>
          <Button type="submit" btnStyle="success" icon="checked-1">
            Save
          </Button>
        </ModalFooter>
      </form>
    );
  }
}

export default CarsMerge;
