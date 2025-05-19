import {throttle} from 'lodash';
import {type AnimatedRef} from 'react-native-reanimated';
import type Animated from 'react-native-reanimated';
import {useSharedValue} from 'react-native-reanimated';

interface UseStagePaginationProps {
  stagesHorizontalScrollRef: AnimatedRef<Animated.FlatList<any>>;
  constants: {
    EDGE_COLUMN_OFFSET: number;
    STAGE_CONTAINER_WIDTH: number;
  };
}

export const useStagePagination = ({stagesHorizontalScrollRef, constants}: UseStagePaginationProps) => {
  const {EDGE_COLUMN_OFFSET, STAGE_CONTAINER_WIDTH} = constants;

  const currentVisibleStageIndex = useSharedValue(0);

  const updateCurrentVisibleStageIndex = (stageIndex: number) => {
    currentVisibleStageIndex.value = stageIndex;
  };

  const paginate = throttle((to: 'left' | 'right' | 'center') => {
    switch (to) {
      case 'right':
        stagesHorizontalScrollRef.current?.scrollToOffset({offset: EDGE_COLUMN_OFFSET + currentVisibleStageIndex.value * STAGE_CONTAINER_WIDTH, animated: true});
        break;
      case 'center':
        stagesHorizontalScrollRef.current?.scrollToOffset({offset: EDGE_COLUMN_OFFSET + (currentVisibleStageIndex.value - 1) * STAGE_CONTAINER_WIDTH, animated: true});
        break;
      case 'left':
        stagesHorizontalScrollRef.current?.scrollToOffset({offset: EDGE_COLUMN_OFFSET + (currentVisibleStageIndex.value - 2) * STAGE_CONTAINER_WIDTH, animated: true});
        break;
    }
  }, 1000, {leading: true, trailing: false});

  return {paginate, updateCurrentVisibleStageIndex};
};
