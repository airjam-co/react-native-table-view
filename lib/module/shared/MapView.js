import { PageTypes } from '@airjam/types';
import { BottomSheet } from 'react-native-sheet';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView from 'react-native-maps';
import WebView from 'react-native-webview';
const deviceHeight = Dimensions.get('window').height;
export function AirJamMapView(_ref) {
  let {
    viewData,
    template,
    style
  } = _ref;
  const bottomSheet = React.useRef(null);
  const [, setBottomSheetOpen] = React.useState(true);
  if (!viewData || !style || !template || !template.templateFields || !template.pageContent) {
    return /*#__PURE__*/React.createElement(View, null);
  }
  const contentList = [];
  for (let i = 1; i < viewData.data.length; i++) {
    if (!viewData.data[i]) continue;
    if (!template.pageContent[PageTypes.LIST]) continue;
    const currentRow = viewData.data[i];
    const templateMap = {};
    Object.keys(template.templateFields).forEach(field => {
      if (viewData.templateFields[field] && currentRow[viewData.templateFields[field]]) {
        templateMap[field] = currentRow[viewData.templateFields[field]].raw_value;
      }
    });
    let pageContent = template.pageContent[PageTypes.LIST];
    Object.entries(templateMap).forEach(entry => {
      const key = entry[0];
      const value = entry[1];
      pageContent = pageContent.replaceAll('{{' + key + '}}', value);
    });
    pageContent = pageContent.replaceAll('{{index}}', i.toString());
    contentList.push('<div class="map-control-entry"><div class="container">' + pageContent + '</div></div>');
  }
  const content = '<meta name="viewport" content="width=device-width, initial-scale=1" />' + '<div class="' + style.containerClassNames.join(' ') + '"><style type="text/css">' + style.style + '</style><div class="map-control">' + contentList.join('\n') + '</div></div>';
  return /*#__PURE__*/React.createElement(View, {
    style: styles.container
  }, /*#__PURE__*/React.createElement(TouchableOpacity, {
    onPress: () => {
      var _bottomSheet$current;
      return (_bottomSheet$current = bottomSheet.current) === null || _bottomSheet$current === void 0 ? void 0 : _bottomSheet$current.show();
    }
  }, /*#__PURE__*/React.createElement(Text, null, "Open bottom sheet")), /*#__PURE__*/React.createElement(BottomSheet, {
    height: deviceHeight * 0.7,
    ref: bottomSheet,
    onOpenFinish: () => setBottomSheetOpen(true),
    onCloseFinish: () => setBottomSheetOpen(false)
  }, /*#__PURE__*/React.createElement(WebView, {
    originWhitelist: ['*'],
    style: {
      backgroundColor: 'transparent'
    },
    source: {
      html: content
    }
  })), /*#__PURE__*/React.createElement(MapView, {
    style: styles.map
  }));
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    width: '100%',
    height: '100%'
  }
});
//# sourceMappingURL=MapView.js.map