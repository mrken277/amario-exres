import { __ } from 'modules/common/utils';
import Wrapper from 'modules/layout/components/Wrapper';
import React from 'react';
import Onboarding from '../containers/Onboarding';

class Robot extends React.PureComponent<{
  entries: any[];
}> {
  render() {
    const { entries } = this.props;

    const content = (
      <>
        <div>
          {entries.map(entry => {
            return (
              <div key={Math.random()}>
                <span>{entry.action}</span>
                <span>{JSON.stringify(entry.data)}</span>
              </div>
            );
          })}
        </div>

        <Onboarding />
      </>
    );

    return (
      <Wrapper
        header={<Wrapper.Header title={__('Robot')} />}
        content={content}
        transparent={true}
        center={true}
      />
    );
  }
}

export default Robot;
