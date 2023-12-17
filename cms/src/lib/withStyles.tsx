import React from 'react';
import {PreviewTemplateComponentProps} from 'decap-cms-core';
import {StyleSheet} from 'react-native-web';

const withStyles =
  (Component: React.ComponentType<PreviewTemplateComponentProps>) =>
  (props: PreviewTemplateComponentProps) => (
    <>
      <style>
        {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          StyleSheet.getSheet().textContent
        }
      </style>
      <Component {...props} />
    </>
  );

export default withStyles;
