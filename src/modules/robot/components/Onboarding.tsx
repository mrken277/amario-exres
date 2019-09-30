import Icon from 'modules/common/components/Icon';
import React from 'react';
import RTG from 'react-transition-group';
import FeatureDetail from '../containers/FeatureDetail';
import { IFeature } from '../types';
import { getAppearance } from '../utils';
import ModulItem from './ModulItem';
import { Back, Content, Greeting } from './styles';

type Props = {
  availableFeatures: IFeature[];
  currentStep?: string;
  changeStep: (step: string) => void;
  forceComplete: () => void;
};

class Onboarding extends React.Component<
  Props,
  { selectedFeature?: IFeature }
> {
  constructor(props) {
    super(props);

    this.state = { selectedFeature: undefined };
  }

  renderFeature(feature: IFeature) {
    const { changeStep } = this.props;
    const { text, isComplete } = feature;

    console.log(isComplete);

    const onClick = () => {
      this.setState({ selectedFeature: feature }, () => {
        changeStep('featureDetail');
      });
    };

    return (
      <ModulItem
        title={text}
        {...getAppearance(feature.name)}
        key={feature.name}
        vertical={true}
        onClick={onClick}
      />
    );
  }

  renderContent() {
    const { selectedFeature } = this.state;
    const { availableFeatures, currentStep, changeStep } = this.props;

    if (currentStep === 'initial') {
      const onClick = () => {
        changeStep('featureList');
      };

      return (
        <div>
          <p>Hi, You haven't configured. Would you like to configure</p>

          <button onClick={onClick}>Yes</button>
        </div>
      );
    }

    if (currentStep === 'inComplete') {
      const onClick = () => {
        changeStep('featureList');
      };

      return (
        <>
          <p>Hi, You haven't fully configured. Would you like to configure</p>

          <button onClick={onClick}>Yes, Resume</button>
        </>
      );
    }

    if (currentStep === 'featureDetail') {
      const onBack = () => {
        this.setState({ selectedFeature: undefined }, () => {
          changeStep('featureList');
        });
      };

      return (
        <>
          <Back onClick={onBack}>
            <Icon icon="arrow-left" size={24} />
          </Back>
          {selectedFeature && <FeatureDetail feature={selectedFeature} />}
        </>
      );
    }

    if (currentStep === 'featureList') {
      return (
        <>
          <Greeting>
            Good morning!{' '}
            <b>
              Ganzorig{' '}
              <span role="img" aria-label="Wave">
                👋
              </span>
            </b>
            <br /> What module do you use usually?
          </Greeting>
          {availableFeatures.map(availabeFeature =>
            this.renderFeature(availabeFeature)
          )}
        </>
      );
    }

    return null;
  }

  onHide = () => {
    this.props.changeStep('');
  };

  render() {
    const { currentStep, forceComplete } = this.props;

    if (!currentStep) {
      return null;
    }

    return (
      <RTG.CSSTransition
        in={true}
        appear={true}
        timeout={500}
        classNames="slide-in-small"
        unmountOnExit={true}
      >
        <Content>
          {this.renderContent()}
          <button onClick={forceComplete}>d</button>
          <button onClick={this.onHide}>x</button>
        </Content>
      </RTG.CSSTransition>
    );
  }
}

export default Onboarding;
