/* eslint-disable prettier/prettier */
import React from 'react';
import { View } from 'react-native';
import { style_cache, tableViewResponse, template_cache, ViewType } from '@airjam/types';
import type { TableViewProps } from './shared/TableViewProps';
import { ListView } from './shared/ListView';
import { NearByView } from './shared/NearByView';
import { AirJamMapView } from './shared/MapView';

const DEFAULT_HOST = "https://airjam.co/s/data?id=";

export function TableView({ id, host, viewData, page, template, style }: TableViewProps): JSX.Element {
  const [, setValue] = React.useState(0); // integer state
  const isMounted = React.useRef<boolean>(false);
  const responseRef = React.useRef<tableViewResponse>();
  const pageRef = React.useRef<number>(1);

  React.useEffect(() => {
    // Anything in here is fired on component mount.
    isMounted.current = true;
    if (viewData) {
      responseRef.current = viewData;
    } else {
      fetchData(host, id, pageRef.current).then( res => { 
        if (res) {
          responseRef.current = res;
          setValue(value => value + 1)
        }
      }).catch((error: any) => {
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
    return <View />;
  }
  const viewType = ViewType[responseRef.current!.type.valueOf() as keyof typeof ViewType];
  const templateData = template ? template : getTemplate(responseRef.current!);
  const styleData = style ? style : getStyle(responseRef.current!);

  if (viewType === ViewType.Nearby) {
    console.log("Rendering nearby");
    return <NearByView id={id} template={templateData} page={page} style={styleData} viewData={responseRef.current} />;
  } else if (viewType === ViewType.List || viewType === ViewType.Gallery) {
    console.log("Rendering gallery or list type");
    return <ListView id={id} template={templateData} page={page} style={styleData} viewData={responseRef.current} />;
  } else if (viewType === ViewType.Map) {
    console.log("Rendering map type");
    return <AirJamMapView id={id} template={templateData} page={page} style={styleData} viewData={responseRef.current} />;
  }
  return <></>;
}

const getTemplate: any = (fetchedData: tableViewResponse) => {
    const cached_entry = Object.entries(template_cache).filter(value => value[0] === fetchedData.templateId);
    if (cached_entry && cached_entry[0] && cached_entry[0].length > 1) {
        return cached_entry[0][1];
    }
    return null;
    // return the template data response returned itself.
}

const getStyle: any = (fetchedData: tableViewResponse) => {
    const cached_entry = Object.entries(style_cache).filter(value => value[0] === fetchedData.styleId);
    if (cached_entry && cached_entry[0] && cached_entry[0].length > 1) {
        return cached_entry[0][1];
    }
    return null;
    // return the style data response returned itself.
}

const fetchData = async (host: string | undefined, id: string, page: number): Promise<tableViewResponse | undefined> => {
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
}
