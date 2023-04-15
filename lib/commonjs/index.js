"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TableView = TableView;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _types = require("@airjam/types");
var _ListView = require("./shared/ListView");
var _NearByView = require("./shared/NearByView");
var _MapView = require("./shared/MapView");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* eslint-disable prettier/prettier */

const DEFAULT_HOST = "https://airjam.co/s/data?id=";
function TableView(_ref) {
  let {
    id,
    host,
    viewData,
    page,
    template,
    style
  } = _ref;
  const [, setValue] = _react.default.useState(0); // integer state
  const isMounted = _react.default.useRef(false);
  const responseRef = _react.default.useRef();
  const pageRef = _react.default.useRef(1);
  _react.default.useEffect(() => {
    // Anything in here is fired on component mount.
    isMounted.current = true;
    if (viewData) {
      responseRef.current = viewData;
    } else {
      fetchData(host, id, pageRef.current).then(res => {
        if (res) {
          responseRef.current = res;
          setValue(value => value + 1);
        }
      }).catch(error => {
        console.log(error);
      });
    }
    if (page) pageRef.current = page;
    console.log('mounted');
    return () => {
      // Anything in here is fired on component unmount.
      isMounted.current = false;
      console.log('unmounted');
    };
  }, [viewData, page, id, host]);
  if (!responseRef.current) {
    console.log("nothing here yet");
    return /*#__PURE__*/_react.default.createElement(_reactNative.View, null);
  }
  const viewType = _types.ViewType[responseRef.current.type.valueOf()];
  const templateData = template ? template : getTemplate(responseRef.current);
  const styleData = style ? style : getStyle(responseRef.current);
  if (viewType === _types.ViewType.Nearby) {
    console.log("Rendering nearby");
    return /*#__PURE__*/_react.default.createElement(_NearByView.NearByView, {
      id: id,
      template: templateData,
      page: page,
      style: styleData,
      viewData: responseRef.current
    });
  } else if (viewType === _types.ViewType.List || viewType === _types.ViewType.Gallery) {
    console.log("Rendering gallery or list type");
    return /*#__PURE__*/_react.default.createElement(_ListView.ListView, {
      id: id,
      template: templateData,
      page: page,
      style: styleData,
      viewData: responseRef.current
    });
  } else if (viewType == _types.ViewType.Map) {
    console.log("Rendering map type");
    return /*#__PURE__*/_react.default.createElement(_MapView.AirJamMapView, {
      id: id,
      template: templateData,
      page: page,
      style: styleData,
      viewData: responseRef.current
    });
  }
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null);
}
const getTemplate = fetchedData => {
  const cached_entry = Object.entries(_types.template_cache).filter(value => value[0] === fetchedData.templateId);
  if (cached_entry && cached_entry[0] && cached_entry[0].length > 1) {
    return cached_entry[0][1];
  }
  return null;
  // return the template data response returned itself.
};

const getStyle = fetchedData => {
  const cached_entry = Object.entries(_types.style_cache).filter(value => value[0] === fetchedData.styleId);
  if (cached_entry && cached_entry[0] && cached_entry[0].length > 1) {
    return cached_entry[0][1];
  }
  return null;
  // return the style data response returned itself.
};

const fetchData = async (host, id, page) => {
  console.log("fetching page:" + page);
  const hostUrl = host ? host : DEFAULT_HOST;
  const json = await fetch(hostUrl + id + "&page=" + page);
  if (json) {
    console.log("done fetching page:" + page);
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
//# sourceMappingURL=index.js.map