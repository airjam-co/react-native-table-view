"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AirJamMapView = AirJamMapView;
var _types = require("@airjam/types");
var _reactNativeSheet = require("react-native-sheet");
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _reactNativeMaps = _interopRequireDefault(require("react-native-maps"));
var _reactNativeWebview = _interopRequireDefault(require("react-native-webview"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const deviceHeight = _reactNative.Dimensions.get('window').height;
function AirJamMapView(_ref) {
  let {
    viewData,
    template,
    style
  } = _ref;
  const bottomSheet = _react.default.useRef(null);
  const [, setBottomSheetOpen] = _react.default.useState(true);
  if (!viewData || !style || !template || !template.templateFields || !template.pageContent) {
    return /*#__PURE__*/_react.default.createElement(_reactNative.View, null);
  }
  const contentList = [];
  for (let i = 1; i < viewData.data.length; i++) {
    if (!viewData.data[i]) continue;
    if (!template.pageContent[_types.PageTypes.LIST]) continue;
    const currentRow = viewData.data[i];
    const templateMap = {};
    Object.keys(template.templateFields).forEach(field => {
      if (viewData.templateFields[field] && currentRow[viewData.templateFields[field]]) {
        templateMap[field] = currentRow[viewData.templateFields[field]].raw_value;
      }
    });
    let pageContent = template.pageContent[_types.PageTypes.LIST];
    Object.entries(templateMap).forEach(entry => {
      const key = entry[0];
      const value = entry[1];
      pageContent = pageContent.replaceAll('{{' + key + '}}', value);
    });
    pageContent = pageContent.replaceAll('{{index}}', i.toString());
    contentList.push('<div class="map-control-entry"><div class="container">' + pageContent + '</div></div>');
  }
  const content = '<meta name="viewport" content="width=device-width, initial-scale=1" />' + '<div class="' + style.containerClassNames.join(' ') + '"><style type="text/css">' + style.style + '</style><div class="map-control">' + contentList.join('\n') + '</div></div>';
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.container
  }, /*#__PURE__*/_react.default.createElement(_reactNative.TouchableOpacity, {
    onPress: () => {
      var _bottomSheet$current;
      return (_bottomSheet$current = bottomSheet.current) === null || _bottomSheet$current === void 0 ? void 0 : _bottomSheet$current.show();
    }
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, null, "Open bottom sheet")), /*#__PURE__*/_react.default.createElement(_reactNativeSheet.BottomSheet, {
    height: deviceHeight * 0.7,
    ref: bottomSheet,
    onOpenFinish: () => setBottomSheetOpen(true),
    onCloseFinish: () => setBottomSheetOpen(false)
  }, /*#__PURE__*/_react.default.createElement(_reactNativeWebview.default, {
    originWhitelist: ['*'],
    style: {
      backgroundColor: 'transparent'
    },
    source: {
      html: content
    }
  })), /*#__PURE__*/_react.default.createElement(_reactNativeMaps.default, {
    style: styles.map
  }));
}
const styles = _reactNative.StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    width: '100%',
    height: '100%'
  }
});
//# sourceMappingURL=MapView.js.map