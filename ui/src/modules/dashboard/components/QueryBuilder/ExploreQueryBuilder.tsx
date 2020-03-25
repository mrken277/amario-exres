import { QueryBuilder } from '@cubejs-client/react';
import { Card, Col, Divider, Row } from 'antd';
import React from 'react';
import ChartRenderer from '../ChartRenderer';
import FilterGroup from './FilterGroup';
import MemberGroup from './MemberGroup';
import SelectChartType from './SelectChartType';
import TimeGroup from './TimeGroup';

const ExploreQueryBuilder = ({
  vizState,
  cubejsApi,
  setVizState,
  chartExtra
}: {
  vizState: any;
  cubejsApi?: any;
  setVizState: any;
  chartExtra: any;
}) => (
  <QueryBuilder
    vizState={vizState}
    setVizState={setVizState}
    cubejsApi={cubejsApi}
    wrapWithQueryRenderer={false}
    render={({
      validatedQuery,
      isQueryPresent,
      chartType,
      updateChartType,
      measures,
      availableMeasures,
      updateMeasures,
      dimensions,
      availableDimensions,
      updateDimensions,
      segments,
      availableSegments,
      updateSegments,
      filters,
      updateFilters,
      timeDimensions,
      availableTimeDimensions,
      updateTimeDimensions
    }) => [
      <Row
        justify='space-around'
        align='top'
        gutter={24}
        style={{
          marginBottom: 12
        }}
        key='1'
      >
        <Col span={24}>
          <Card>
            <Row
              justify='space-around'
              align='top'
              gutter={24}
              style={{
                marginBottom: 12
              }}
            >
              <Col span={24}>
                <MemberGroup
                  members={measures}
                  availableMembers={availableMeasures}
                  addMemberName='Measure'
                  updateMethods={updateMeasures}
                />
                <Divider type='vertical' />
                <MemberGroup
                  members={dimensions}
                  availableMembers={availableDimensions}
                  addMemberName='Dimension'
                  updateMethods={updateDimensions}
                />
                <Divider type='vertical' />
                <MemberGroup
                  members={segments}
                  availableMembers={availableSegments}
                  addMemberName='Segment'
                  updateMethods={updateSegments}
                />
                <Divider type='vertical' />
                <TimeGroup
                  members={timeDimensions}
                  availableMembers={availableTimeDimensions}
                  addMemberName='Time'
                  updateMethods={updateTimeDimensions}
                />
              </Col>
            </Row>
            <Row
              justify='space-around'
              align='top'
              gutter={24}
              style={{
                marginBottom: 12
              }}
            >
              <Col span={24}>
                <FilterGroup
                  members={filters}
                  availableMembers={availableDimensions.concat(
                    availableMeasures
                  )}
                  addMemberName='Filter'
                  updateMethods={updateFilters}
                />
              </Col>
            </Row>
            <Row justify='space-around' align='top' gutter={24}>
              <Col span={24}>
                <SelectChartType
                  chartType={chartType}
                  updateChartType={updateChartType}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>,
      <Row justify='space-around' align='top' gutter={24} key='2'>
        <Col span={24}>
          {isQueryPresent ? (
            <Card
              style={{
                minHeight: 420
              }}
              extra={chartExtra}
            >
              <ChartRenderer
                vizState={{
                  query: validatedQuery,
                  chartType
                }}
                cubejsApi={cubejsApi}
              />
            </Card>
          ) : (
            <h2
              style={{
                textAlign: 'center'
              }}
            >
              Choose a measure or dimension to get started
            </h2>
          )}
        </Col>
      </Row>
    ]}
  />
);

export default ExploreQueryBuilder;
