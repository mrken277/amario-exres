import React from 'react';
import { IFeature } from '../types';
import { FEATURE_DETAILS } from './constants';

class FeatureDetail extends React.Component<{
  feature: IFeature;
  actionsCompleteness: { [key: string]: boolean };
}> {
  render() {
    const { feature, actionsCompleteness } = this.props;

    const detail = FEATURE_DETAILS[feature.name];

    return (
      <div>
        <div style={{ margin: '10px 0px', color: '#5629B6' }}>
          <h2>{detail.description}</h2>
        </div>

        <div>
          <video width="300" height="100" controls={true}>
            <source src={detail.videoUrl} />
          </video>
        </div>

        <div style={{ margin: '10px 0px', color: '#5629B6' }}>
          <h2>Related actions:</h2>
        </div>

        <ul>
          {detail.actions.map((action, index) => {
            let color;

            if (actionsCompleteness[action.name]) {
              color = 'green';
            }

            return (
              <li key={index}>
                <h5>
                  <a href={action.url} style={{ color }}>
                    {action.name}
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
