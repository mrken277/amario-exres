import { ChooseColor } from 'modules/boards/styles/label';
import Button from 'modules/common/components/Button';
import CollapseContent from 'modules/common/components/CollapseContent';
import FormControl from 'modules/common/components/form/Control';
import Form from 'modules/common/components/form/Form';
import FormGroup from 'modules/common/components/form/Group';
import ControlLabel from 'modules/common/components/form/Label';
import Icon from 'modules/common/components/Icon';
import {
  FormColumn,
  FormWrapper,
  ModalFooter,
  ScrollWrapper
} from 'modules/common/styles/main';
import { IButtonMutateProps, IFormProps } from 'modules/common/types';
import { __ } from 'modules/common/utils';
import { BackgroundSelector } from 'modules/leads/components/step/style';
import SelectTeamMembers from 'modules/settings/team/containers/SelectTeamMembers';
import React from 'react';
import { IUser } from '../../../auth/types';
import { ICar, ICarDoc } from '../../types';
import { COLORS } from 'modules/boards/constants';

type Props = {
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  car: ICar;
  closeModal: () => void;
};

type State = {
  ownerId?: string;
  doNotDisturb?: string;
  users?: IUser[];

  plateNumber: string;
  vinNumber: string;
  colorCode: string;

  manufactureBrand: string;
  bodyType: string;
  fuelType: string;
  modelsName: string;
  series: string;
  gearBox: string;

  vintageYear: number;
  importYear: number;
};

class CarForm extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    const { car = {} } = props;

    this.state = {
      ownerId: car.ownerId || '',
      doNotDisturb: car.doNotDisturb || 'No',
      users: [],
      plateNumber: car.plateNumber || '',
      vinNumber: car.vinNumber || '',
      colorCode: car.colorCode || '',

      manufactureBrand: car.manufactureBrand || '',
      bodyType: car.bodyType || '',
      fuelType: car.fuelType || '',
      modelsName: car.modelsName || '',
      series: car.series || '',
      gearBox: car.gearBox || '',

      vintageYear: car.vintageYear || 2020,
      importYear: car.importYear || 2020,
    };
  }

  generateDoc = (
    values: { _id: string; size?: number } & ICarDoc
  ) => {
    const { car } = this.props;

    const finalValues = values;

    if (car) {
      finalValues._id = car._id;
    }

    return {
      _id: finalValues._id,
      ...this.state,
      description: finalValues.description,
    };
  };

  generateConstantParams(constants) {
    return constants.map(constant => ({
      value: constant,
      label: constant
    }));
  }

  renderFormGroup = (label, props) => {
    return (
      <FormGroup>
        <ControlLabel>{label}</ControlLabel>
        <FormControl {...props} />
      </FormGroup>
    );
  };

  onBodyTypeChange = option => {
    this.setState({ bodyType: option.value });
  };

  onFuelTypeChange = option => {
    this.setState({ fuelType: option.value });
  };

  onColorChange = e => {
    this.setState({ colorCode: e.hex });
  };

  renderColors(colorCode: string) {
    const onClick = () => this.onColorChange(colorCode);

    return (
      <BackgroundSelector
        key={colorCode}
        selected={this.state.colorCode === colorCode}
        onClick={onClick}
      >
        <div style={{ backgroundColor: colorCode }}>
          <Icon icon="check-1" />
        </div>
      </BackgroundSelector>
    );
  }


  // onChange = (
  //   optionsName: string,
  //   optionName: string,
  //   { options, selectedOption }: { options: string[]; selectedOption: string }
  // ) => {
  //   this.setState({ [optionsName]: options, [optionName]: selectedOption });
  // };

  renderContent = (formProps: IFormProps) => {
    const car = this.props.car || ({} as ICar);
    const { closeModal, renderButton } = this.props;
    const { values, isSubmitted } = formProps;

    const { ownerId } = this.state;

    const onSelectOwner = value => {
      this.setState({
        'ownerId': value
      } as Pick<State, keyof State>);
    };

    return (
      <>
        <ScrollWrapper>
          <CollapseContent
            title={__('General information')}
            compact={true}
            open={true}
          >
            <FormWrapper>
              <FormColumn>
                {this.renderFormGroup('Plate number', {
                  ...formProps,
                  name: 'plateNumber',
                  defaultValue: car.plateNumber || ''
                })}

                {this.renderFormGroup('VIN number', {
                  ...formProps,
                  name: 'vinNumber',
                  defaultValue: car.vinNumber || ''
                })}

                <FormGroup>
                  <ControlLabel required={true}>Select a color</ControlLabel>
                  <ChooseColor>
                    {COLORS.map(colorCode => this.renderColors(colorCode))}
                  </ChooseColor>
                </FormGroup>

                <FormGroup>
                  <ControlLabel>Owner</ControlLabel>
                  <SelectTeamMembers
                    label="Choose an owner"
                    name="ownerId"
                    value={ownerId}
                    onSelect={onSelectOwner}
                    multi={false}
                  />
                </FormGroup>
              </FormColumn>
            </FormWrapper>
            <FormWrapper>
              <FormColumn>
                <FormGroup>
                  <ControlLabel>Description</ControlLabel>
                  <FormControl
                    {...formProps}
                    max={140}
                    name="description"
                    componentClass="textarea"
                    defaultValue={car.description || ''}
                  />
                </FormGroup>
              </FormColumn>
              <FormColumn>
                {this.renderFormGroup('Do not disturb', {
                  componentClass: 'radio',
                  options: [
                    {
                      childNode: 'Yes',
                      value: 'Yes',
                      checked: this.state.doNotDisturb === 'Yes',
                      onChange: e =>
                        this.setState({ doNotDisturb: e.target.value })
                    },
                    {
                      childNode: 'No',
                      value: 'No',
                      checked: this.state.doNotDisturb === 'No',
                      onChange: e =>
                        this.setState({ doNotDisturb: e.target.value })
                    }
                  ]
                })}
              </FormColumn>
            </FormWrapper>
          </CollapseContent>
        </ScrollWrapper>

        <ModalFooter>
          <Button btnStyle="simple" onClick={closeModal} icon="cancel-1">
            Close
          </Button>

          {renderButton({
            name: 'car',
            values: this.generateDoc(values),
            isSubmitted,
            object: this.props.car
          })}
        </ModalFooter>
      </>
    );
  };

  render() {
    return <Form renderContent={this.renderContent} />;
  }
}

export default CarForm;
