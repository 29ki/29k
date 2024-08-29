'use client';
import React, {useRef, useState} from 'react';
import {useServerInsertedHTML} from 'next/navigation';
import {ServerStyleSheet, StyleSheetManager} from 'styled-components';
import {AppRegistry} from 'react-native';

export default function StyleSheetRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const isServerInserted = useRef(false);

  // Only create stylesheet once with lazy initial state
  // x-ref: https://reactjs.org/docs/hooks-reference.html#lazy-initial-state
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet());

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement();
    styledComponentsStyleSheet.instance.clearTag();
    return <>{styles}</>;
  });

  useServerInsertedHTML(() => {
    if (!isServerInserted.current) {
      isServerInserted.current = true;
      AppRegistry.registerComponent('App', () => () => children);
      // @ts-ignore
      const {getStyleElement} = AppRegistry.getApplication('App', {});
      return <>{getStyleElement()}</>;
    }
  });

  if (typeof window !== 'undefined') return <>{children}</>;

  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
      {children}
    </StyleSheetManager>
  );
}
