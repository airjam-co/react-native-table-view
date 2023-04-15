import React, { useState } from 'react';
import { StyleSheet, Text, FlatList, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// utils and helpers

const NumPad = props => {
  const {
    onItemClick,
    onItemKeyClick,
    onSubmit,
    onDeleteItem
  } = props;
  const [actionId, setActionId] = useState(0);
  const numberRange = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'X', '0', '.'];
  const onButtonPress = item => {
    setActionId(actionId + 1);
    switch (item) {
      case 'X':
        // send delete meta data
        onItemKeyClick === null || onItemKeyClick === void 0 ? void 0 : onItemKeyClick({
          value: item,
          actionType: 'delete',
          actionId
        });
        // directly manipulate data on delete with this callback
        onDeleteItem === null || onDeleteItem === void 0 ? void 0 : onDeleteItem();
        break;
      case '.':
        onSubmit();
        break;
      default:
        // send the value directly
        onItemClick === null || onItemClick === void 0 ? void 0 : onItemClick(item);
        // send the value along with meta data
        onItemKeyClick === null || onItemKeyClick === void 0 ? void 0 : onItemKeyClick({
          value: item,
          actionType: 'insert',
          actionId
        });
        break;
    }
  };
  return /*#__PURE__*/React.createElement(View, null, /*#__PURE__*/React.createElement(FlatList, {
    data: numberRange,
    horizontal: false,
    scrollEnabled: false,
    numColumns: 3,
    keyExtractor: item => item,
    renderItem: _ref => {
      let {
        item
      } = _ref;
      return /*#__PURE__*/React.createElement(TouchableOpacity, {
        style: styles.rippleContainer,
        onPress: () => onButtonPress(item)
      }, item === 'X' || item === '.' ? /*#__PURE__*/React.createElement(Icon, {
        name: item === 'X' ? 'backspace' : 'check',
        size: 36
      }) : /*#__PURE__*/React.createElement(Text, {
        style: [styles.numberText]
      }, item));
    }
  }));
};
const styles = StyleSheet.create({
  numberText: {
    fontSize: 36
  },
  rippleContainer: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
export default NumPad;
//# sourceMappingURL=Numpad.js.map