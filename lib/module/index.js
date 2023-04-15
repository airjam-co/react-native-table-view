/* eslint-disable prettier/prettier */
import React from 'react';
import { View } from 'react-native';
import { style_cache, template_cache, ViewType } from '@airjam/types';
import { ListView } from './shared/ListView';
import { NearByView } from './shared/NearByView';
import { AirJamMapView } from './shared/MapView';
const DEFAULT_HOST = "https://airjam.co/s/data?id=";
export function TableView(_ref) {
  let {
    id,
    host,
    viewData,
    page,
    template,
    style
  } = _ref;
  const [, setValue] = React.useState(0); // integer state
  const isMounted = React.useRef(false);
  const responseRef = React.useRef();
  const pageRef = React.useRef(1);
  React.useEffect(() => {
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
    return /*#__PURE__*/React.createElement(View, null);
  }
  const viewType = ViewType[responseRef.current.type.valueOf()];
  const templateData = template ? template : getTemplate(responseRef.current);
  const styleData = style ? style : getStyle(responseRef.current);
  if (viewType === ViewType.Nearby) {
    console.log("Rendering nearby");
    return /*#__PURE__*/React.createElement(NearByView, {
      id: id,
      template: templateData,
      page: page,
      style: styleData,
      viewData: responseRef.current
    });
  } else if (viewType === ViewType.List || viewType === ViewType.Gallery) {
    console.log("Rendering gallery or list type");
    return /*#__PURE__*/React.createElement(ListView, {
      id: id,
      template: templateData,
      page: page,
      style: styleData,
      viewData: responseRef.current
    });
  } else if (viewType == ViewType.Map) {
    console.log("Rendering map type");
    return /*#__PURE__*/React.createElement(AirJamMapView, {
      id: id,
      template: templateData,
      page: page,
      style: styleData,
      viewData: responseRef.current
    });
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null);
}
const getTemplate = fetchedData => {
  const cached_entry = Object.entries(template_cache).filter(value => value[0] === fetchedData.templateId);
  if (cached_entry && cached_entry[0] && cached_entry[0].length > 1) {
    return cached_entry[0][1];
  }
  return null;
  // return the template data response returned itself.
};

const getStyle = fetchedData => {
  const cached_entry = Object.entries(style_cache).filter(value => value[0] === fetchedData.styleId);
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