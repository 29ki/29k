import React from 'react';
import {StyleSheetManager} from 'styled-components';

export default Component => props => {
  const iframe = document.querySelector('#nc-root iframe');
  const iframeHeadElem = iframe && iframe.contentDocument.head;
  console.log('iframeHeadElem', iframeHeadElem);
  if (!iframeHeadElem) {
    return null;
  }

  return (
    <StyleSheetManager target={iframeHeadElem}>
      <Component {...props} />
    </StyleSheetManager>
  );
};
