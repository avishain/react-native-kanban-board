import {Gesture} from 'react-native-gesture-handler';
import {runOnJS, withSpring, useSharedValue} from 'react-native-reanimated';
import {type useStagePagination} from './useStagePagination';
import {SCREEN_WIDTH} from '../shared/constants';
import {useState} from 'react';
import {type KanbanBoardProps, type DraggedItemProps, type ItemType} from '../shared/types';

interface UseDragGestureProps<T extends ItemType, K> {
  toStageIndex: number;
  paginate: ReturnType<typeof useStagePagination>['paginate'];
  onDragEndSuccess: KanbanBoardProps<T, K>['onDragEnd'];
  onDrop: () => void;
}

export const useDragGesture = <T extends ItemType, K>({paginate, toStageIndex, onDragEndSuccess, onDrop}: UseDragGestureProps<T, K>) => {
  const [dragItem, setDragItem] = useState<DraggedItemProps<T>>();

  const dragX = useSharedValue(0);
  const dragY = useSharedValue(0);

  const drop = () => {
    onDrop();

    const isBeingDragged = dragItem !== undefined;

    if (isBeingDragged) {
      if (dragItem.stageIndex !== toStageIndex) {
        onDragEndSuccess({fromStageIndex: dragItem.stageIndex, toStageIndex, itemId: dragItem.id});
      }

      setDragItem(undefined);
    }
  };

  const pan = Gesture.Pan()
    .manualActivation(true)
    .onTouchesMove((_, stateManager) => {
      if (dragItem?.id) {
        stateManager.activate();
      }
    })
    .onChange((event) => {
      dragX.value = event.translationX;
      dragY.value = event.translationY;

      if (event.absoluteX > SCREEN_WIDTH - 50) {
        runOnJS(paginate)('right');
      }

      if (event.absoluteX < 50) {
        runOnJS(paginate)('left');
      }
    })
    .onEnd(() => {
      dragX.value = withSpring(0, {duration: 1000});
      dragY.value = withSpring(0, {duration: 1000});
    })
    .onFinalize(() => {
      runOnJS(drop)();
    });

  return {pan, dragItem, setDragItem, dragX, dragY};
};
