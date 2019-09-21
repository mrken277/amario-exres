import React from 'react';
import { IFeature } from '../types';
import { FEATURE_DETAILS } from './constants';

class FeatureDetail extends React.Component<{
  feature: IFeature;
  settingsCompleteness: { [key: string]: boolean };
}> {
  render() {
    const { feature, settingsCompleteness } = this.props;

    const detail = FEATURE_DETAILS[feature.name];

    return (
      <div>
        <div style={{ margin: '10px 0px', color: '#5629B6' }}>
          <h2>{detail.description}</h2>
        </div>

        <div>
          <video width="600" height="400" controls={true}>
            <source src={detail.videoUrl} />
          </video>
        </div>

        <div style={{ margin: '10px 0px', color: '#5629B6' }}>
          <h2>Related settings:</h2>
        </div>

        <ul>
          {detail.settings.map((setting, index) => {
            let color;

            if (settingsCompleteness[setting.name]) {
              color = 'green';
            }

            return (
              <li key={index}>
                <h5>
                  <a href={setting.url} target="__blank" style={{ color }}>
                    {setting.name}
                  </a>
                </h5>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

export default FeatureDetail;
