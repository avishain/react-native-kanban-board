import React from 'react';
import { Dimensions, StyleSheet, Button, View, Text } from 'react-native';
import KanbanBoard from './index';
import { type KanbanBoardProps } from './shared/types';
import { useSetLayoutAnimationOnVisibilityChange } from './hooks/useSetLayoutAnimationOnVisibilityChange';

const SCREEN_WIDTH = Dimensions.get('screen').width;

export type State = {
  wixImage: boolean;
};

type HeaderParams = {
  title: string;
  subtitle?: string;
};

type ItemParams = {
  id: string;
};

const KanbanBoardExample = () => {
  const [stageWidth, setStageWidth] = React.useState(SCREEN_WIDTH * .75);

  useSetLayoutAnimationOnVisibilityChange(stageWidth);

  const renderItem = (props: { id: string }, isDragged?: boolean) => {
    return (
      <View style={[styles.itemContainer, { backgroundColor: isDragged ? 'rgb(150, 170, 180)' : 'rgb(255,255,255)' }]}>
        <Text>{props.id}</Text>
      </View>
    );
  };

  const renderHeader = (props: HeaderParams) => {
    return (
      <View>
        <Text style={{ fontWeight: 'bold' }}>{props.title}</Text>
        <Text>{props.subtitle}</Text>
      </View>
    );
  };

  const stages: KanbanBoardProps<ItemParams, HeaderParams>['stages'] = [
    {
      header: { title: 'Stage 1' },
      items: [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }],
    },
    {
      header: { title: 'Stage 2', subtitle: 'with subtitle 22' },
      items: [{ id: '6' }, { id: '7' }, { id: '8' }, { id: '9' }, { id: '10' }],
    },
    {
      header: { title: 'Stageee 3', subtitle: 'with subtitle 333' },
      items: [{ id: '11' }, { id: '12' }, { id: '13' }, { id: '14' }, { id: '15' }],
    },
    {
      header: { title: 'Stage 4' },
      items: [{ id: '16' }, { id: '17' }, { id: '18' }, { id: '19' }, { id: '20' }],
    },
    {
      header: { title: 'Stage 5', subtitle: 'with subtitle 55555' },
      items: [{ id: '21' }, { id: '22' }, { id: '23' }, { id: '24' }, { id: '25' }, { id: '26' }, { id: '27' }, { id: '28' }, { id: '29' }, { id: '30' }, { id: '31' }, { id: '32' }, { id: '33' }, { id: '34' }, { id: '35' }],
    },
  ];

  const onDragEnd = ({ fromStageIndex, toStageIndex, itemId }: { fromStageIndex: number; toStageIndex: number; itemId: string }) => {
    alert(`from stage: ${fromStageIndex} \n to stage: ${toStageIndex}\n item id: ${itemId}`);
  };

  return (
    <>
      <Button title='switch' onPress={() => setStageWidth(curr => SCREEN_WIDTH * 1.4 - curr)} />
      <KanbanBoard
        stages={stages}
        renderItem={renderItem}
        renderHeader={renderHeader}
        stageContainerStyle={styles.stageContainer}
        gapBetweenStages={10}
        stageWidth={stageWidth}
        stageContainerStyleOnDragHover={styles.stageContainerWhenPotenialDragTo}
        onDragEnd={onDragEnd}
      />
    </>
  );
};

const styles = StyleSheet.create({
  stageContainer: {
    backgroundColor: 'blue',
    borderRadius: 12,
  },
  dragItem: {
    backgroundColor: 'yellow',
  },
  stageContainerWhenPotenialDragTo: {
    opacity: .7,
  },
  itemContainer: {
    paddingVertical: 10,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default KanbanBoardExample;
