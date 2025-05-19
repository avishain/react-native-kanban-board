import { JSX } from 'react';
import { type ViewStyle } from 'react-native';

export interface DraggedItemProps<T> {
  id: string;
  y: number;
  x: number;
  width: number;
  props: T;
  stageIndex: number;
}

/**
 * Items must have 'id' (string)
 */
export interface KanbanBoardProps<T extends ItemType, K> {
  stages: Stage<T, K>[];
  renderItem: (props: T, isDragged?: boolean) => JSX.Element;
  renderHeader: (props: K) => JSX.Element;
  onDragEnd: (params: { fromStageIndex: number; toStageIndex: number; itemId: string }) => void;
  /**
   * Style for the container (the component that holds the stages)
   */
  containerStyle?: ViewStyle;
  /**
   * Style for the container (the component that holds the stages)
   */
  contentContainerStyle?: ViewStyle;
  /**
   * Style of stage
   */
  stageContainerStyle?: ViewStyle;
  /**
   * Style of stage when a card is dragged an currently hoverring it
   */
  stageContainerStyleOnDragHover?: ViewStyle;
  /**
   * Default: 80% of screen's width
   */
  stageWidth?: number;
  /**
   * Default: 12
   */
  gapBetweenStages?: number;
}

export type Stage<T, K> = {
  header: K;
  items: T[];
};

export type ItemType = { id: string };
