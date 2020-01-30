import * as Factory from 'factory.ts';
import { ISegment, ISegmentCondition } from 'modules/segments/types';

export const segmentConditionFactory = Factory.Sync.makeFactory<ISegmentCondition>({
  _id: '1',
  field: 'string',
  value: 'string',
  operator: 'string',
  dateUnit: 'string',
  type: 'string',
  brandId: 'string'
});

export const segmentFactory = Factory.Sync.makeFactory<ISegment>({
  _id: '1',
  contentType: 'type',
  getSubSegments: [],
  getParentSegment: {} as ISegment,
  name: 'erxes',
  description: 'desc',
  color: '#fff',
  connector: 'string',
  conditions: [segmentConditionFactory.build()],
  subOf: 'sub',
});
