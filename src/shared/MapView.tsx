import { PageTypes } from '@airjam/types';
import { BottomSheet, BottomSheetRef } from 'react-native-sheet';
import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { TableViewProps } from './TableViewProps';
import MapView from 'react-native-maps';
import WebView from 'react-native-webview';

const deviceHeight = Dimensions.get('window').height;

export function AirJamMapView({
  viewData,
  template,
  style,
}: TableViewProps): JSX.Element {
  const bottomSheet = React.useRef<BottomSheetRef>(null);
  const [, setBottomSheetOpen] = React.useState<boolean>(true);

  if (
    !viewData ||
    !style ||
    !template ||
    !template.templateFields ||
    !template.pageContent
  ) {
    return <View />;
  }
  const contentList = [];
  for (let i = 1; i < viewData.data.length; i++) {
    if (!viewData.data[i]) continue;
    if (!template.pageContent[PageTypes.LIST]) continue;
    const currentRow = viewData.data[i]!;
    const templateMap: { [id: string]: string } = {};

    Object.keys(template.templateFields).forEach((field: string) => {
      if (
        viewData.templateFields[field] &&
        currentRow[viewData.templateFields[field]!]
      ) {
        templateMap[field] =
          currentRow[viewData.templateFields[field]!]!.raw_value;
      }
    });
    let pageContent = template.pageContent[PageTypes.LIST]!;
    Object.entries(templateMap).forEach((entry: any[]) => {
      const key = entry[0];
      const value = entry[1];
      pageContent = pageContent.replaceAll('{{' + key + '}}', value);
    });
    pageContent = pageContent.replaceAll('{{index}}', i.toString());
    contentList.push(
      '<div class="map-control-entry"><div class="container">' +
        pageContent +
        '</div></div>'
    );
  }
  const content =
    '<meta name="viewport" content="width=device-width, initial-scale=1" />' +
    '<div class="' +
    style!.containerClassNames.join(' ') +
    '"><style type="text/css">' +
    style.style +
    '</style><div class="map-control">' +
    contentList.join('\n') +
    '</div></div>';
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => bottomSheet.current?.show()}>
        <Text>Open bottom sheet</Text>
      </TouchableOpacity>
      <BottomSheet
        height={deviceHeight * 0.7}
        ref={bottomSheet}
        onOpenFinish={() => setBottomSheetOpen(true)}
        onCloseFinish={() => setBottomSheetOpen(false)}
      >
        <WebView
          originWhitelist={['*']}
          style={{ backgroundColor: 'transparent' }}
          source={{ html: content }}
        />
      </BottomSheet>
      <MapView style={styles.map} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
