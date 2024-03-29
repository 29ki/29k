import React from 'react';
import {PreviewTemplateComponentProps} from 'decap-cms-core';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {StyleSheetManager} from 'styled-components';
// eslint-disable-next-line
// @ts-ignore
import {createSheet} from 'react-native-web/dist/exports/StyleSheet/dom';

const withRNStyles =
  (Component: React.ComponentType<PreviewTemplateComponentProps>) =>
  (props: PreviewTemplateComponentProps) => {
    const iframe = document.getElementById(
      'preview-pane',
    ) as HTMLIFrameElement | null;
    const iframeHeadElem = iframe?.contentWindow?.document.head;

    // This is to force react-native-web to add styles to iframe head
    createSheet(iframeHeadElem);

    return (
      // This is to force styled-components to add styles to iframe head
      <StyleSheetManager target={iframeHeadElem}>
        <SafeAreaProvider>
          <Component {...props} />
        </SafeAreaProvider>
      </StyleSheetManager>
    );
  };

export default withRNStyles;
