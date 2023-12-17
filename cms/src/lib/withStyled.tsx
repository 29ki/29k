import React from 'react';
import {PreviewTemplateComponentProps} from 'decap-cms-core';
import {StyleSheet} from 'react-native-web';

const withStyles =
  (Component: React.ComponentType<PreviewTemplateComponentProps>) =>
  (props: PreviewTemplateComponentProps) => {
    return (
      <>
        <Component {...props} />
        <style>{StyleSheet.getSheet().textContent}</style>
      </>
    );
  };

export default withStyles;
