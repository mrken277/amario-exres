import React from 'react';
import { Link } from 'react-router-dom';
import { IFeature } from '../types';

class FeatureDetail extends React.Component<{
  feature: IFeature;
  actionsCompleteness: { [key: string]: boolean };
}> {
  render() {
    const { feature, actionsCompleteness } = this.props;

    return (
      <div>
        <div style={{ margin: '10px 0px', color: '#5629B6' }}>
          <h2>{feature.description}</h2>
        </div>

        <div>
          <video width="300" height="100" controls={true}>
            <source src={feature.videoUrl} />
          </video>
        </div>

        <div style={{ margin: '10px 0px', color: '#5629B6' }}>
          <h2>Related actions:</h2>
        </div>

        <ul>
          {feature.actions.map((action, index) => {
            let color;

            if (actionsCompleteness[action.name]) {
              color = 'green';
            }

            return (
              <li key={index}>
                <h5>
                  <Link to={action.url} style={{ color }}>
                    {action.name}
                  </Link>
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
