# react-native-kanban-board
#### Kanban board for React-Native apps

A performant and customizable Kanban board component for React Native, enabling drag and drop functionality between stages. Built with React Native Reanimated for smooth animations and gestures.

[![npm version](https://badge.fury.io/js/react-native-kanban-board.svg)](https://www.npmjs.com/package/react-native-kanban-board)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

https://github.com/user-attachments/assets/6b92c787-76c4-4c91-9c8a-947149f457f3


<br/>

## Features

- **Drag and Drop:** Smoothly drag and drop items between different stages (columns).
- **Horizontal Stage Scrolling:** Easily navigate through multiple stages with horizontal scrolling and snapping.
- **Customizable Stages:** Define your own stages with custom headers and data.
- **Customizable Items:** Render your items with a custom component.
- **Stage Width Control:** Adjust the width of individual stages.
- **Gap Between Stages:** Control the spacing between stages.
- **Drag Hover Styling:** Style the stage when an item is being dragged over it.
- **`onDragEnd` Callback:** Get notified when an item is dropped into a new stage, providing information about the source and destination.
- **Built with Reanimated:** Utilizes React Native Reanimated for fluid and performant animations.

## Installation

```bash
npm install react-native-kanban-board
```
or
```bash
yarn add react-native-kanban-board
```
## Props

| Prop                      | Type                                                                                             | Description                                                                                                 | Default Value           | Required |
| :------------------------ | :----------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------- | :------------------------ | :------- |
| `stages`                  | `Stage<T extends ItemType, K>[]`                                                                | An array of stage objects, each containing a `header` of type `K` and an array of `items` of type `T`.      | `[]`                      | Yes      |
| `renderItem`              | `(props: T, isDragged?: boolean) => JSX.Element`                                                | Function that renders each item within a stage. `isDragged` is a boolean indicating if the item is being dragged. |                                           | Yes      |
| `renderHeader`            | `(props: K) => JSX.Element`                                                                      | Function that renders the header for each stage.                                                            |                                           | Yes      |
| `onDragEnd`               | `(params: { fromStageIndex: number; toStageIndex: number; itemId: string }) => void`            | Callback function called when an item is dropped into a new stage, providing the source and destination stage indices and the item's ID. | `undefined`               | Yes      |
| `containerStyle`          | `ViewStyle`                                                                                    | Style for the outer container of the Kanban board component.                                                | `{}`                      | No       |
| `contentContainerStyle`   | `ViewStyle`                                                                                    | Style for the content container of the horizontal `FlatList` that renders the stages.                       | `{}`                      | No       |
| `stageContainerStyle`     | `ViewStyle`                                                                                    | Style for the container of each individual stage.                                                           | `{}`                      | No       |
| `stageContainerStyleOnDragHover` | `ViewStyle`                                                                                    | Style applied to a stage container when an item is being dragged over it.                                   | `{ opacity: 0.7 }`        | No       |
| `stageWidth`              | `number`                                                                                       | The width of each stage container. Defaults to 80% of the screen's width.                                 | `SCREEN_WIDTH * 0.8`      | No       |
| `gapBetweenStages`        | `number`                                                                                       | The horizontal gap between the stages. Defaults to 12.                                                      | `12`                      | No       |


**Type Definitions:**

```typescript
import type { StyleProp, ViewStyle } from 'react-native';

export type ItemType = {
  id: string | number;
  [key: string]: any;
};

export type Stage<T extends ItemType, K> = {
  header: K;
  items: T[];
};

export type KanbanBoardProps<T extends ItemType, K> = {
  stages: Stage<T, K>[];
  renderItem: (item: T, isDragged?: boolean) => React.ReactNode;
  renderHeader: (header: K) => React.ReactNode;
  stageContainerStyle?: StyleProp<ViewStyle>;
  gapBetweenStages?: number;
  stageWidth?: number;
  stageContainerStyleOnDragHover?: StyleProp<ViewStyle>;
  onDragEnd?: ({ fromStageIndex: number, toStageIndex: number, itemId: string }) => void;
  contentContainerStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
};
```

## Example Usage (Complete)

```jsx
import React from 'react';
import { Dimensions, StyleSheet, Button, View, Text } from 'react-native';
import KanbanBoard from 'react-native-kanban-board';
import { type KanbanBoardProps } from 'react-native-kanban-board/shared/types';

const SCREEN_WIDTH = Dimensions.get('screen').width;

type HeaderParams = {
  title: string;
  subtitle?: string;
};

type ItemParams = {
  id: string;
};

const KanbanBoardExample = () => {
  const [stageWidth, setStageWidth] = React.useState(SCREEN_WIDTH * .75);

  const renderItem = (props: ItemParams, isDragged?: boolean) => {
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
        {props.subtitle && <Text>{props.subtitle}</Text>}
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
    padding: 10,
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
```

## Contributing

Contributions are welcome\! 
Please open a PR so I'll review before merging.


## License

MIT

