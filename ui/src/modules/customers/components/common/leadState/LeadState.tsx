
import Icon from 'modules/common/components/Icon';
import React, { useState } from 'react';
import { datas } from './constants';
import { LeadStateWrapper, StateItem } from './styles';

function LeadState() {
	const [currentState, setCuttentState] = useState(0);

  return (
    <LeadStateWrapper>
			{datas.map((data, index) => 
				// tslint:disable-next-line: jsx-no-lambda
				<StateItem key={data.name} past={index < currentState} active={index === currentState} onClick={() => setCuttentState(index)}>
					<div>
						{index < currentState && <Icon icon="check-1" size={16} />}
						{data.name} 
						{data.time && <span> {data.time}</span>}
					</div>
				</StateItem>
			)}
    </LeadStateWrapper>
  );
}

export default LeadState;
