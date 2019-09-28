import React from 'react';
import { Link } from 'react-router-dom';
import { IFeature } from '../types';

class FeatureDetail extends React.Component<{
  feature: IFeature;
  completeShowStep: () => void;
  stepsCompleteness: { [key: string]: boolean };
}> {
  renderSettings() {
    const { feature, stepsCompleteness } = this.props;

    if (!feature.showSettings) {
      return null;
    }

    return (
      <>
        <div style={{ margin: '10px 0px', color: '#5629B6' }}>
          <h2>Related settings:</h2>
        </div>

        <ul>
          {feature.settings.map((setting, index) => {
            let color;

            if (stepsCompleteness[setting]) {
              color = 'green';
            }

            const detail = feature.settingsDetails[setting];

            return (
              <li key={index}>
                <h5>
                  <Link to={detail.url} style={{ color }}>
                    {detail.name}
                  </Link>
                </h5>
              </li>
            );
          })}
        </ul>
      </>
    );
  }

  onVideoClick = () => {
    // tslint:disable
    console.log('on video click');

    this.props.completeShowStep();
  };

  render() {
    const { feature } = this.props;

    return (
      <div>
        <div style={{ margin: '10px 0px', color: '#5629B6' }}>
          <h2>{feature.description}</h2>
        </div>

        <div>
          <video
            width="300"
            height="100"
            controls={true}
            onClick={this.onVideoClick}
          >
            <source src="https://www.youtube.com/watch?v=fxXfN198rXE&t=965s" />
          </video>
        </div>

        {this.renderSettings()}
      </div>
    );
  }
}

export default FeatureDetail;
