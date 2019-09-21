import { __ } from 'modules/common/utils';
import React from 'react';
import FeatureDetail from '../containers/FeatureDetail';
import { IFeature } from '../types';

type Feature = {
  name: string;
  text: string;
};

class Onboarding extends React.Component<{}, { selectedFeature?: Feature }> {
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
      <div>
        {this.renderFeature({ name: 'inbox', text: 'Inbox' })}
        {this.renderFeature({ name: 'contacts', text: 'Contact' })}
        {this.renderFeature({ name: 'deals', text: 'Deals' })}
        {this.renderFeature({ name: 'tasks', text: 'Tasks' })}
        {this.renderFeature({ name: 'tickets', text: 'Tickets' })}
        {this.renderFeature({ name: 'growthHacks', text: 'Growth Hacks' })}
        {this.renderFeature({ name: 'engages', text: 'Engages' })}
        {this.renderFeature({ name: 'leads', text: 'Leads' })}
        {this.renderFeature({ name: 'knowledgebase', text: 'Knowledgebase' })}
        {this.renderFeature({ name: 'insights', text: 'Insights' })}
        {this.renderFeature({ name: 'imports', text: 'Imports' })}
        {this.renderFeature({ name: 'tags', text: 'Tags' })}
        {this.renderFeature({ name: 'segments', text: 'Segments' })}
        {this.renderFeature({ name: 'propertes', text: 'Properties' })}
        {this.renderFeature({ name: 'permissions', text: 'Permissions' })}
        {this.renderFeature({ name: 'integrations', text: 'Integrations' })}
      </div>
    );
  }
}

export default Onboarding;
