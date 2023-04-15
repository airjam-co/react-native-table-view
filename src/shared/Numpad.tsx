import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  FlatList,
  View,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// utils and helpers
import type { NumPadProps } from './NumPad.types';

const NumPad = (props: NumPadProps) => {
  const { onItemClick, onItemKeyClick, onSubmit, onDeleteItem } = props;
  const [actionId, setActionId] = useState(0);
  const numberRange = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'X',
    '0',
    '.',
  ];

  const onButtonPress = (item: string) => {
    setActionId(actionId + 1);
    switch (item) {
      case 'X':
        // send delete meta data
        onItemKeyClick?.({
          value: item,
          actionType: 'delete',
          actionId,
        });
        // directly manipulate data on delete with this callback
        onDeleteItem?.();
        break;
      case '.':
        onSubmit();
        break;
      default:
        // send the value directly
        onItemClick?.(item);
        // send the value along with meta data
        onItemKeyClick?.({
          value: item,
          actionType: 'insert',
          actionId,
        });
        break;
    }
  };

  return (
    <View>
      <FlatList
        data={numberRange}
        horizontal={false}
        scrollEnabled={false}
        numColumns={3}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.rippleContainer}
            onPress={() => onButtonPress(item)}
          >
            {item === 'X' || item === '.' ? (
              <Icon name={item === 'X' ? 'backspace' : 'check'} size={36} />
            ) : (
              <Text style={[styles.numberText]}>{item}</Text>
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  numberText: {
    fontSize: 36,
  },
  rippleContainer: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default NumPad;
