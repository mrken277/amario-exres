import { __ } from 'modules/common/utils';
import Wrapper from 'modules/layout/components/Wrapper';
import React from 'react';
import Onboarding from './Onboarding';

class Robot extends React.PureComponent<{
  robotEntries: any[];
}> {
  render() {
    const { robotEntries } = this.props;

    const content = (
      <>
        <div>
          {robotEntries.map(entry => {
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
