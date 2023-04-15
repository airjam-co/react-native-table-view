"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _MaterialIcons = _interopRequireDefault(require("react-native-vector-icons/MaterialIcons"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
// utils and helpers

const NumPad = props => {
  const {
    onItemClick,
    onItemKeyClick,
    onSubmit,
    onDeleteItem
  } = props;
  const [actionId, setActionId] = (0, _react.useState)(0);
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
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, null, /*#__PURE__*/_react.default.createElement(_reactNative.FlatList, {
    data: numberRange,
    horizontal: false,
    scrollEnabled: false,
    numColumns: 3,
    keyExtractor: item => item,
    renderItem: _ref => {
      let {
        item
      } = _ref;
      return /*#__PURE__*/_react.default.createElement(_reactNative.TouchableOpacity, {
        style: styles.rippleContainer,
        onPress: () => onButtonPress(item)
      }, item === 'X' || item === '.' ? /*#__PURE__*/_react.default.createElement(_MaterialIcons.default, {
        name: item === 'X' ? 'backspace' : 'check',
        size: 36
      }) : /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
        style: [styles.numberText]
      }, item));
    }
  }));
};
const styles = _reactNative.StyleSheet.create({
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
var _default = NumPad;
exports.default = _default;
//# sourceMappingURL=Numpad.js.map