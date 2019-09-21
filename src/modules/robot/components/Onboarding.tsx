import React from 'react';
import FeatureDetail from '../containers/FeatureDetail';
import { IFeature } from '../types';

type Feature = {
  name: string;
  text: string;
};

class Onboarding extends React.Component<
  { availableFeatures: IFeature[] },
  { selectedFeature?: Feature }
> {
  constructor(props) {
    super(props);

    this.state = {
      selectedFeature: undefined
    };
  }

  renderFeature(feature: Feature) {
    const { text } = feature;

    const onClick = () => {
      this.setState({ selectedFeature: feature });
    };

    return (
      <div
        key={feature.name}
        style={{
          width: '150px',
          height: '150px',
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

  onFeatureClick = (feature: IFeature) => {
    this.setState({ selectedFeature: feature });
  };

  onBack = () => {
    this.setState({ selectedFeature: undefined });
  };

  render() {
    const { selectedFeature } = this.state;
    const { availableFeatures } = this.props;

    if (selectedFeature) {
      return (
        <>
          <button onClick={this.onBack}>back</button>
          <FeatureDetail
            feature={selectedFeature}
            onClick={this.onFeatureClick}
          />
        </>
      );
    }

    return (
      <div>{availableFeatures.map(feature => this.renderFeature(feature))}</div>
    );
  }
}

export default Onboarding;
