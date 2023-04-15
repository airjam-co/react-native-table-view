import { PageTypes } from '@airjam/types';
import React from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';
export function ListView(_ref) {
  let {
    viewData,
    template,
    style
  } = _ref;
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
    contentList.push('<div key="list.' + i + '">' + pageContent + '</div>');
  }
  const content = '<meta name="viewport" content="width=device-width, initial-scale=1" />' + '<div class="' + style.containerClassNames.join(' ') + '"><style type="text/css">' + style.style + '</style>' + contentList.join('\n') + '</div>';
  return /*#__PURE__*/React.createElement(WebView, {
    originWhitelist: ['*'],
    useWebView2: true,
    source: {
      html: content
    }
  });
}
//# sourceMappingURL=ListView.js.map