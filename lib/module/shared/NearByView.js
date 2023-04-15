import React from 'react';
import { BottomSheet } from 'react-native-sheet';
import { PageTypes } from '@airjam/types';
import { Animated, Dimensions, DeviceEventEmitter, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { BarCodeScanner } from 'expo-barcode-scanner';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Beacons from '@rodrigo77777/react-native-beacons-manager';
import NumPad from './Numpad';
const DEFAULT_HOST = 'https://airjam.co/s/data?id=';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
export function NearByView(_ref) {
  let {
    id,
    host,
    viewData,
    template,
    style
  } = _ref;
  const bottomSheet = React.useRef(null);
  const [bottomSheetOpen, setBottomSheetOpen] = React.useState(false);
  const [text, setText] = React.useState('');
  const bleValue = React.useRef('');
  const [, setValue] = React.useState(0); // integer state
  const detailContent = React.useRef('');
  const [permission, setHasPermission] = React.useState(undefined);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    return () => {
      // Anything in here is fired on component unmount.
      console.log('unmounting in progress');
    };
  }, []);
  const handleBarCodeScanned = code => {
    if (code.data === text && bottomSheetOpen) {
      return;
    }
    setText(code.data);
    showDetail(code.data);
  };
  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true
    }).start(() => {
      setTimeout(() => {
        fadeOut();
      }, 1500);
    });
  };
  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true
    }).start();
  };
  const fetchDetailData = async query => {
    const searchText = query ? query : text;
    console.log('Fetching detail:' + searchText);
    const hostUrl = host ? host : DEFAULT_HOST;
    const json = await fetch(hostUrl + id + '&q=' + searchText);
    if (json) {
      console.log('Done fetching text:' + searchText);
      const resp = await json.json();
      if (resp) {
        console.log(resp);
        return resp;
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  };

  // we currently do not support QR+NUMERIC combo, because the UI real-estate is scarce
  const guideMessages = {
    'QR': /*#__PURE__*/React.createElement(Text, {
      style: styles.description
    }, /*#__PURE__*/React.createElement(FontAwesome5, {
      name: 'qrcode',
      size: 40,
      light: true
    }), '\n', '\n', "Scan the QR code on the artwork label."),
    'BLE': /*#__PURE__*/React.createElement(Text, {
      style: styles.description
    }, /*#__PURE__*/React.createElement(FontAwesome5, {
      name: 'wifi',
      size: 40,
      light: true
    }), '\n', '\n', "Move closer to the artwork with your device."),
    'NUMERIC': /*#__PURE__*/React.createElement(Text, {
      style: styles.description
    }, /*#__PURE__*/React.createElement(FontAwesome5, {
      name: 'headphones',
      size: 40,
      light: true
    }), '\n', '\n', "Enter the number on the artwork label."),
    'BLE,QR': /*#__PURE__*/React.createElement(Text, {
      style: styles.description
    }, /*#__PURE__*/React.createElement(FontAwesome5, {
      name: 'qrcode',
      size: 40,
      light: true
    }), "\xA0\xA0\xA0", /*#__PURE__*/React.createElement(FontAwesome5, {
      name: 'wifi',
      size: 40,
      light: true
    }), '\n', '\n', "Scan the QR code on the artwork label or move closer to the artwork."),
    'BLE,NUMERIC': /*#__PURE__*/React.createElement(Text, {
      style: styles.description
    }, /*#__PURE__*/React.createElement(FontAwesome5, {
      name: 'headphones',
      size: 40,
      light: true
    }), "\xA0\xA0\xA0", /*#__PURE__*/React.createElement(FontAwesome5, {
      name: 'wifi',
      size: 40,
      light: true
    }), '\n', '\n', "Enter the number on the artwork label or move closer to the artwork.")
  };
  const renderInstruction = selectedInterface => {
    for (let i = selectedInterface.length; i >= 0; i--) {
      for (let j = 0; j < i; j++) {
        const searchString = selectedInterface.slice(j, i).join(',');
        if (guideMessages[searchString]) return guideMessages[searchString];
      }
    }
    return /*#__PURE__*/React.createElement("p", null, "Visual interface is not set up");
  };
  const showDetail = query => {
    fetchDetailData(query).then(detailResult => {
      var _bottomSheet$current;
      if (!detailResult || !template) return;
      if (detailResult.data.length < 2) {
        fadeIn();
        return;
      }
      const contentList = [];
      for (let i = 1; i < detailResult.data.length; i++) {
        if (!detailResult.data[i]) continue;
        if (!template.pageContent[PageTypes.DETAIL]) continue;
        const currentRow = detailResult.data[i];
        const templateMap = {};
        Object.keys(template.templateFields).forEach(field => {
          if (detailResult.templateFields[field] && currentRow[detailResult.templateFields[field]]) {
            templateMap[field] = currentRow[detailResult.templateFields[field]].raw_value;
          }
        });
        let pageContent = template.pageContent[PageTypes.DETAIL];
        Object.entries(templateMap).forEach(entry => {
          const key = entry[0];
          const value = entry[1];
          pageContent = pageContent.replaceAll('{{' + key + '}}', value);
        });
        contentList.push('<div class="' + style.containerClassNames.join(' ') + '"><div key="detail.' + i + '"><style type="text/css">' + style.style + '</style>' + pageContent + '</div></div>');
      }
      detailContent.current = '<meta name="viewport" content="width=device-width, initial-scale=1" />' + contentList.join('\n');
      console.log(detailContent.current);
      setValue(value => value + 1);
      (_bottomSheet$current = bottomSheet.current) === null || _bottomSheet$current === void 0 ? void 0 : _bottomSheet$current.show();
    }).catch(error => {
      console.log(error);
    });
  };
  if (!viewData || !template || !style || !template.templateFields || !template.pageContent) {
    return /*#__PURE__*/React.createElement(View, null);
  }
  // let pageContent = template.pageContent[PageTypes.LANDING]!;
  // const content =
  //   '<meta name="viewport" content="width=device-width, initial-scale=1" />' +
  //   '<div class="' +
  //   style!.containerClassNames.join(' ') +
  //   '"><style type="text/css">' +
  //   style!.style +
  //   '</style>' +
  //   pageContent +
  //   '</div>';

  const barcode = /*#__PURE__*/React.createElement(View, {
    style: styles.container
  }, /*#__PURE__*/React.createElement(View, {
    style: styles.scannerContainer
  }, /*#__PURE__*/React.createElement(BarCodeScanner, {
    onBarCodeScanned: handleBarCodeScanned,
    style: StyleSheet.absoluteFillObject
  }), /*#__PURE__*/React.createElement(View, {
    style: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)'
    }
  }), /*#__PURE__*/React.createElement(View, {
    style: {
      width: deviceWidth,
      height: deviceWidth,
      borderColor: 'rgba(0,0,0,0.5)',
      borderWidth: deviceWidth / 6
    }
  }, /*#__PURE__*/React.createElement(View, {
    style: {
      flex: 1,
      borderColor: '#fff',
      borderWidth: 3
    }
  })), /*#__PURE__*/React.createElement(View, {
    style: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)'
    }
  })));
  const numpad = /*#__PURE__*/React.createElement(View, {
    style: styles.numPadContainer
  }, /*#__PURE__*/React.createElement(Text, {
    style: styles.numPadText
  }, text), /*#__PURE__*/React.createElement(NumPad, {
    onItemKeyClick: stroke => {
      if (!stroke) return;
      if (stroke.actionType === 'delete' && text) {
        let txt = new String(text);
        txt = txt.substring(0, txt.length - 1);
        setText(txt.toString());
      } else {
        setText(text + stroke.value);
      }
    },
    onSubmit: () => {
      showDetail(undefined);
    }
  }));
  const bleOnly = /*#__PURE__*/React.createElement(React.Fragment, null);
  let visualScanInterface = /*#__PURE__*/React.createElement(Text, null, "Visual interface is not set up");
  const selectedInterfaceRaw = viewData.templateProperties.lookupInterface ? viewData.templateProperties.lookupInterface : [];
  const selectedInterface = selectedInterfaceRaw.map(s => {
    return s.toUpperCase();
  }).sort();
  const instruction = renderInstruction(selectedInterface);
  if (selectedInterface.includes('BLE')) {
    visualScanInterface = bleOnly;
    const searchUuid = viewData.templateProperties.iBeaconUuid;
    console.log('enabling ble for ' + searchUuid);
    const region = {
      identifier: 'artwork',
      uuid: searchUuid
    };
    Beacons.requestWhenInUseAuthorization();
    Beacons.startMonitoringForRegion(region);
    Beacons.startRangingBeaconsInRegion(region);
    Beacons.startUpdatingLocation();
    DeviceEventEmitter.addListener('beaconsDidRange', data => {
      if (data && data.beacons && Array.isArray(data.beacons) && data.beacons.length > 0) {
        const firstBeacon = data.beacons[0];
        if (firstBeacon && firstBeacon.major && bleValue.current !== firstBeacon.major && text !== firstBeacon.major) {
          console.log('updating artwork, because ble:' + bleValue.current + ' | text: ' + text + ' | beacon: ' + firstBeacon.major);
          bleValue.current = firstBeacon.major;
          setText(firstBeacon.major);
          showDetail(firstBeacon.major);
        }
      } else {
        if (bleValue.current) {
          // user left the range to applicable artworks.
          console.log('removing artwork ble:' + bleValue.current + ' | text: ' + text);
          bleValue.current = '';
          setText('');
        }
      }
    });
  }
  if (selectedInterface.includes('QR')) {
    if (!permission) {
      const getBarCodeScannerPermissions = async () => {
        const {
          status
        } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
      };
      getBarCodeScannerPermissions();
    } else {
      visualScanInterface = barcode;
    }
  } else if (selectedInterface.includes('NUMERIC')) {
    visualScanInterface = numpad;
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Animated.View, {
    style: [styles.toast, {
      // Bind opacity to animated value
      opacity: fadeAnim
    }]
  }, /*#__PURE__*/React.createElement(Text, null, '\n', '\n', /*#__PURE__*/React.createElement(FontAwesome5, {
    name: 'question',
    size: 40,
    light: true
  }), '\n', '\n'), /*#__PURE__*/React.createElement(Text, null, "Artwork is not found")), /*#__PURE__*/React.createElement(BottomSheet, {
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
      html: detailContent.current
    }
  })), /*#__PURE__*/React.createElement(SafeAreaView, {
    style: {
      flex: 1
    }
  }, instruction, visualScanInterface));
}
const styles = StyleSheet.create({
  description: {
    padding: 20,
    fontSize: 18,
    textAlign: 'center',
    zIndex: 4,
    color: '#fff',
    backgroundColor: 'rgba(10, 10, 10,0.6)'
  },
  numPadText: {
    flex: 1,
    justifyContent: 'center',
    fontSize: 32,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 20
  },
  numPadContainer: {
    flex: 1,
    paddingBottom: 20
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  scannerContainer: {
    position: 'absolute',
    width: deviceWidth,
    height: deviceHeight
  },
  toast: {
    zIndex: 5,
    backgroundColor: 'rgba(0,0,0,0.6)',
    position: 'absolute',
    alignItems: 'center',
    top: '50%',
    left: '50%',
    padding: 20,
    borderRadius: 20,
    width: 200,
    height: 200,
    transform: [{
      translateX: -100
    }, {
      translateY: -100
    }]
  }
});
//# sourceMappingURL=NearByView.js.map