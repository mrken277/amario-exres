import * as Factory from 'factory.ts';
import { ISegment, ISegmentCondition } from 'modules/segments/types';

export const segmentConditionFactory = Factory.Sync.makeFactory<
  ISegmentCondition
>({
  key: '15',
  type: 'string'
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
  conditions: [
    segmentConditionFactory.build(),
    segmentConditionFactory.build({ key: '2' })
  ],
  subOf: 'sub'
});
