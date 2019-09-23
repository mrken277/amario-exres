import React from 'react';
import FeatureDetail from '../containers/FeatureDetail';
import { IFeature } from '../types';

type Feature = {
  name: string;
  text: string;
};

type Props = {
  availableFeatures: IFeature[];
  currentStep?: string;
  changeStep: (step: string) => void;
};

class Onboarding extends React.Component<Props, { selectedFeature?: Feature }> {
  constructor(props) {
    super(props);

    this.state = { selectedFeature: undefined };
  }

  renderFeature(feature: Feature) {
    const { changeStep } = this.props;
    const { text } = feature;

    const onClick = () => {
      this.setState({ selectedFeature: feature }, () => {
        changeStep('featureDetail');
      });
    };

    return (
      <div
        key={feature.name}
        style={{
          width: '100px',
          height: '100px',
          float: 'left',
          border: '1px solid',
          marginRight: '10px',
          display: 'inline-flex',
          cursor: 'pointer',
          marginBottom: '10px'
        }}
        onClick={onClick}
      >
        <div style={{ margin: 'auto' }}>{text}</div>
      </div>
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
          <button>No</button>
        </div>
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
          <button onClick={onBack}>back</button>
          {selectedFeature && <FeatureDetail feature={selectedFeature} />}
        </>
      );
    }

    if (currentStep === 'featureList') {
      return availableFeatures.map(feature => this.renderFeature(feature));
    }

    return null;
  }

  render() {
    const { currentStep } = this.props;

    if (!currentStep) {
      return null;
    }

    return (
      <div
        style={{
          backgroundColor: '#a5a2a2',
          position: 'fixed',
          width: '400px',
          height: '700px',
          left: '80px',
          paddingLeft: '30px',
          paddingTop: '30px',
          bottom: '50px'
        }}
      >
        {this.renderContent()}
      </div>
    );
  }
}

export default Onboarding;
