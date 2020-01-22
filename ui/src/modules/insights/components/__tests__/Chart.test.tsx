import * as React from 'react';

import { IChartParams } from 'modules/insights/types';
import { create } from 'react-test-renderer';
import Chart from '../Chart';

const chartData: IChartParams[] = [
  {
    x: '2020-01-19',
    y: 19
  },
  {
    x: '2020-01-18',
    y: 18
  },
  {
    x: '2020-01-20',
    y: 20
  }
];

describe('Insight Component', () => {
  it('should render chart', () => {
    const testRenderer = create(<Chart data={chartData} height={200} />);
    const testInstance = testRenderer.root;

    expect(testRenderer.toJSON()).toMatchSnapshot();
    expect(testInstance.findByType(Chart).props.height).toBe(200);
  });
});
