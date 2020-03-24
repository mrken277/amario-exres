import gql from 'graphql-tag';
import * as compose from 'lodash.flowright';
import EmptyState from 'modules/common/components/EmptyState';
import Spinner from 'modules/common/components/Spinner';
import { IRouterProps } from 'modules/common/types';
import { router as routerUtils, withProps } from 'modules/common/utils';
import React, { useEffect, useState } from 'react';
import { graphql } from 'react-apollo';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { withRouter } from 'react-router';
import styled from 'styled-components';
import { queries } from '../graphql';
import {
  IItemMap,
  IOptions,
  IPipeline,
  IStageMap,
  StagesQueryResponse
} from '../types';
import { PipelineConsumer, PipelineProvider } from './PipelineContext';
import Stage from './Stage';

const Container = styled.div`
  height: 100%;
  display: inline-flex;
`;

type Props = {
  pipeline: IPipeline;
  initialItemMap?: IItemMap;
  stageMap?: IStageMap;
  queryParams: any;
  options: IOptions;
};

const WithStages = (props: WithStatesQueryProps) => {
  const {
    initialItemMap,
    pipeline,
    stageMap,
    options,
    queryParams,
    stagesQuery
  } = props;

  const stagesCount = Object.keys(stageMap || {}).length;
  // const initStageFinishMap = Object.keys(stageMap || {}).reduce(
  //   (acc, stageId) => ({ ...acc, [stageId]: false }),
  //   {}
  // );

  const [stageFinishMap, setStageFinishMap] = useState({});

  useEffect(
    () => {
      const { pipelineId } = props.queryParams;

      if (queryParamsChanged(queryParams, props.queryParams)) {
        stagesQuery.refetch({ pipelineId });
      }
    },
    [props.queryParams]
  );

  const afterFinish = () => {
    const currentTab = sessionStorage.getItem('currentTab');

    // don't reload current tab
    if (!currentTab) {
      const pipelineUpdate = sessionStorage.getItem('pipelineUpdate');

      // if there is a newRequest
      if (pipelineUpdate === 'newRequest') {
        routerUtils.setParams(props.history, { key: Math.random() });
      }

      sessionStorage.setItem('pipelineUpdate', 'end');
    }
  };

  const queryParamsChanged = (beforeQueryParams, nextQueryParams) => {
    if (
      nextQueryParams.itemId ||
      (!beforeQueryParams.key && queryParams.itemId)
    ) {
      return false;
    }

    if (beforeQueryParams !== nextQueryParams) {
      return true;
    }

    return false;
  };

  const onChangeStageFinishMap = (stageId: string) => {
    setStageFinishMap({ ...stageFinishMap, [stageId]: true });
  };

  if (stagesCount === 0) {
    return (
      <EmptyState
        image="/images/actions/8.svg"
        text="No stage in this pipeline"
        size="small"
        light={true}
      />
    );
  }

  return (
    <PipelineProvider
      pipeline={pipeline}
      initialItemMap={initialItemMap}
      queryParams={queryParams}
      options={options}
      queryParamsChanged={queryParamsChanged}
      afterFinish={afterFinish}
    >
      <PipelineConsumer>
        {({
          stageLoadMap,
          itemMap,
          onDragEnd,
          stageIds,
          scheduleStage,
          onLoadStage,
          onAddItem,
          onRemoveItem
        }) => (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable
              droppableId="pipeline"
              type="STAGE"
              direction="horizontal"
              ignoreContainerClipping={true}
            >
              {provided => (
                <Container
                  innerRef={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {stageIds.map((stageId, index) => {
                    const stage = stageMap && stageMap[stageId];

                    if (!stage) {
                      return null;
                    }

                    return (
                      <Stage
                        options={options}
                        key={stageId}
                        index={index}
                        length={stagesCount}
                        stage={stage}
                        items={itemMap[stageId]}
                        queryParams={queryParams}
                        loadingState={stageLoadMap[stageId]}
                        refetchStages={stagesQuery.refetch}
                        scheduleStage={scheduleStage}
                        onLoad={onLoadStage}
                        onAddItem={onAddItem}
                        onRemoveItem={onRemoveItem}
                        onChangeStageFinishMap={onChangeStageFinishMap}
                      />
                    );
                  })}
                  {provided.placeholder}
                </Container>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </PipelineConsumer>
    </PipelineProvider>
  );
};

type WithStatesQueryProps = {
  stagesQuery: StagesQueryResponse;
} & IRouterProps &
  Props;

const WithStatesQuery = (props: WithStatesQueryProps) => {
  const { stagesQuery } = props;

  if (stagesQuery.loading) {
    return <Spinner />;
  }

  const stages = stagesQuery.stages || [];

  const itemMap: IItemMap = {};
  const stageMap: IStageMap = {};

  for (const stage of stages) {
    itemMap[stage._id] = [];
    stageMap[stage._id] = stage;
  }

  return <WithStages {...props} stageMap={stageMap} initialItemMap={itemMap} />;
};

export default withProps<Props>(
  compose(
    graphql<Props, StagesQueryResponse>(gql(queries.stages), {
      name: 'stagesQuery',
      options: ({ pipeline, queryParams, options: { getExtraParams } }) => ({
        variables: {
          pipelineId: pipeline._id,
          search: queryParams.search,
          customerIds: queryParams.customerIds,
          companyIds: queryParams.companyIds,
          assignedUserIds: queryParams.assignedUserIds,
          labelIds: queryParams.labelIds,
          extraParams: getExtraParams(queryParams),
          closeDateType: queryParams.closeDateType,
          userIds: queryParams.userIds
        }
      })
    })
  )(withRouter(WithStatesQuery))
);
