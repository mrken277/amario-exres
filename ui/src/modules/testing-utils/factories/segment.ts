import * as Factory from 'factory.ts';
import { ISegment, ISegmentCondition } from 'modules/segments/types';

export const segmentConditionFactory = Factory.Sync.makeFactory<ISegmentCondition>({
  _id: '15',
  field: 'auto',
  value: 'string',
  operator: 'string',
  dateUnit: 'string',
  type: 'string',
  brandId: 'string',
});

export const segmentFactory = Factory.Sync.makeFactory<ISegment>({
  _id: '5',
  contentType: 'type',
  getSubSegments: [],
  getParentSegment: {} as ISegment,

  // ISegmentDocs
  name: 'segment',
  description: 'desc',
  color: '#fff',
  connector: 'connect',
  conditions: [
    segmentConditionFactory.build(),
    segmentConditionFactory.build({ _id: '15' })
  ],
  subOf: 'sub'
});