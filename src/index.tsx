import React, { useCallback, useEffect, useRef } from 'react';
import { type NativeScrollEvent, type NativeSyntheticEvent, FlatList, View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, { interpolate, useAnimatedRef, useAnimatedStyle } from 'react-native-reanimated';
import { useState } from 'react';
import { type ItemType, type Stage, type KanbanBoardProps } from './shared/types';
import { DragContext } from './shared/DraggedItemContext';
import { CardItem } from './components/CardItem';
import { useStagePagination } from './hooks/useStagePagination';
import { useDragGesture } from './hooks/useDragGesture';
import { DEFAULT_STAGE_WIDTH, DEFAULT_STAGES_GAP, SCREEN_WIDTH } from './shared/constants';

const KanbanBoard = <T extends ItemType, K>(props: KanbanBoardProps<T, K>) => {
  const [toStageIndex, setToStageIndex] = useState(0);

  const STAGE_CONTAINER_WIDTH = props.stageWidth ?? (SCREEN_WIDTH * DEFAULT_STAGE_WIDTH);
  const SCROLL_TRIGGER_WIDTH = SCREEN_WIDTH * .3;
  const EDGE_COLUMN_OFFSET = STAGE_CONTAINER_WIDTH * 1.5 - SCREEN_WIDTH * .5;
  const ON_ALIGNMENT_MARGIN = (SCREEN_WIDTH - STAGE_CONTAINER_WIDTH) / 2;

  const constants = { STAGE_CONTAINER_WIDTH, SCROLL_TRIGGER_WIDTH, EDGE_COLUMN_OFFSET, ON_ALIGNMENT_MARGIN };
  const GAP_BETWEEN_STAGES = props.gapBetweenStages ?? DEFAULT_STAGES_GAP;

  const stagesHorizontalScrollRef = useAnimatedRef<Animated.FlatList<K>>();
  const itemsVerticalScrollEnabledRef = useRef(false);

  const disableScrollers = useCallback(() => {
    itemsVerticalScrollEnabledRef.current = false;
    stagesHorizontalScrollRef.current?.setNativeProps({ scrollEnabled: false });
  }, [stagesHorizontalScrollRef, itemsVerticalScrollEnabledRef]);

  function enableScrollers() {
    stagesHorizontalScrollRef.current?.setNativeProps({ scrollEnabled: true });
    itemsVerticalScrollEnabledRef.current = true;
  }

  const { paginate, updateCurrentVisibleStageIndex } = useStagePagination({ stagesHorizontalScrollRef, constants });
  const { pan, dragItem, dragX, dragY, setDragItem } = useDragGesture({ paginate, toStageIndex, onDrop: enableScrollers, onDragEndSuccess: props.onDragEnd });

  useEffect(() => {
    setTimeout(() => {
      paginate('center');
    }, 200);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.stageWidth]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      top: dragItem?.y,
      left: dragItem?.x,
      width: dragItem?.width,
      transform: [
        { translateY: dragY.value },
        { translateX: dragX.value },
        { rotate: interpolate(dragX.value, [-SCROLL_TRIGGER_WIDTH, 0, SCROLL_TRIGGER_WIDTH], [-12, 0, 12], 'clamp') + 'deg' },
        { scale: interpolate(dragX.value, [-SCROLL_TRIGGER_WIDTH, 0, SCROLL_TRIGGER_WIDTH], [1.1, 1, 1.1], 'clamp') },
      ],
    };
  }, [dragItem]);

  const renderStage = ({ item: stage, index: i }: { item: Stage<T, K>; index: number }) => {
    const isPotentiallyBeingMoveTo = dragItem?.stageIndex !== undefined && i !== dragItem.stageIndex && toStageIndex === i;
    const isItemInFocusedStage = i === toStageIndex;

    const renderCard = ({ item }: { item: T }) => {
      const isBeingDragged = dragItem?.id === item.id;

      return (
        <CardItem
          disableScrollers={disableScrollers}
          setDragItem={setDragItem}
          renderItem={props.renderItem}
          isDraggable={!dragItem && isItemInFocusedStage}
          itemStageIndex={i}
          item={item}
          isBeingDragged={isBeingDragged}
        />
      );
    };

    return (
      <View
        key={i}
        style={[
          props.stageContainerStyle,
          { margin: GAP_BETWEEN_STAGES, padding: GAP_BETWEEN_STAGES, width: STAGE_CONTAINER_WIDTH - GAP_BETWEEN_STAGES * 2 },
          isPotentiallyBeingMoveTo ? props.stageContainerStyleOnDragHover : {},
        ]}
      >
        {props.renderHeader(stage.header)}
        <FlatList
          scrollEnabled={itemsVerticalScrollEnabledRef.current}
          data={stage.items}
          renderItem={renderCard}
          keyExtractor={(_, index) => `${i}-${index}`}
          extraData={isItemInFocusedStage}
          initialNumToRender={i === 0 ? 8 : 3}
        />
      </View>
    );
  };

  const onMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const stageIndex = event.nativeEvent.contentOffset.x === 0 ? 0 :
      Math.round((event.nativeEvent.contentOffset.x + ON_ALIGNMENT_MARGIN) / STAGE_CONTAINER_WIDTH);
    updateCurrentVisibleStageIndex(stageIndex);
    setToStageIndex(stageIndex);
  };

  return (
    <DragContext.Provider
      value={{
        setDragItem,
        dragItemY: dragItem?.id ? dragY : undefined,
        dragItemX: dragItem?.id ? dragX : undefined,
        dragItem: dragItem?.props,
      }}
    >
      <GestureDetector gesture={pan}>
        <>
          <Animated.FlatList
            ref={stagesHorizontalScrollRef}
            horizontal
            pagingEnabled
            snapToInterval={STAGE_CONTAINER_WIDTH}
            snapToAlignment={'center'}
            decelerationRate={'fast'}
            onMomentumScrollEnd={onMomentumScrollEnd}
            data={props.stages}
            renderItem={renderStage}
            contentContainerStyle={props.contentContainerStyle}
            style={props.containerStyle}
          />

          {dragItem?.props && (
            <Animated.View style={animatedStyle}>
              {props.renderItem(dragItem.props as T, true)}
            </Animated.View>
          )}
        </>
      </GestureDetector>
    </DragContext.Provider>
  );
};

export default KanbanBoard;
