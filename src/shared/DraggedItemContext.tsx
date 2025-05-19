import { createContext, useContext } from 'react';
import { type SharedValue } from 'react-native-reanimated';
import { type ItemType, type DraggedItemProps } from './types';

type DragContext<T extends ItemType> = {
  setDragItem: (props: DraggedItemProps<T>) => void;
  dragItem?: T;
  dragItemY?: SharedValue<number>;
  dragItemX?: SharedValue<number>;
  dragOffsetY?: SharedValue<number>;
};

export const DragContext = createContext<DragContext<ItemType> | undefined>(undefined);

export const useDragContext = () => useContext(DragContext);
