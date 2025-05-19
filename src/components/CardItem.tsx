import React, { createRef, useRef } from 'react';
import { type LayoutChangeEvent, Pressable, View } from 'react-native';
import { type KanbanBoardProps, type ItemType, type DraggedItemProps } from '../shared/types';

interface CardItemProps<T extends ItemType, K> {
  item: T;
  isDraggable: boolean;
  itemStageIndex: number;
  renderItem: KanbanBoardProps<T, K>['renderItem'];
  disableScrollers: () => void;
  isBeingDragged: boolean;
  setDragItem: (props: DraggedItemProps<T>) => void;
}

export const CardItem = React.memo(<_, K>({ item, setDragItem, renderItem, itemStageIndex, isDraggable, disableScrollers, isBeingDragged }: CardItemProps<any, K>) => {
  const positionRef = useRef<{ x: number; y: number; width: number }>(undefined);

  const onLongPress = () => {
    if (positionRef.current && isDraggable) {
      disableScrollers();

      viewRef.current?.measureInWindow((x, y, width) => {
        setDragItem({ props: item, width, x, y: y - 100, stageIndex: itemStageIndex, id: item.id });
      });
    }
  };

  const onLayout = (event: LayoutChangeEvent) => {
    event.currentTarget.measure((_x, _y, width, _height, pageX, pageY) => {
      positionRef.current = { x: pageX, y: pageY, width };
    });
  };

  const viewRef = createRef<View>();

  return (
    <Pressable delayLongPress={200} style={{ opacity: isBeingDragged ? 0 : 1, marginVertical: 2 }} onLongPress={onLongPress} onLayout={onLayout}>
      <View ref={viewRef}>
        {renderItem(item)}
      </View>
    </Pressable>
  );
});
