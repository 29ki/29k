import React from 'react';
import {Platform, StatusBar} from 'react-native';

export const StatusBarRegular = () => {
  if (Platform.OS === 'android') {
    return null;
  }

  return <StatusBar barStyle="dark-content" />;
};

// Use to get ligth status bar text on a dark background
export const StatusBarOnDark = () => {
  if (Platform.OS === 'android') {
    return null;
  }

  return <StatusBar barStyle="light-content" />;
};
