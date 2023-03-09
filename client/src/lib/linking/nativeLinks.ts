import {Linking} from 'react-native';
import * as metrics from '../metrics';
import {appendOrigin} from './utils/url';

export const openURL = async (URL: string) => {
  metrics.logEvent('Open Link', {URL});

  if (!(await Linking.canOpenURL(URL))) {
    return;
  }

  try {
    await Linking.openURL(URL);
  } catch (e) {}
};

export const getInitialURL = async () => {
  const url = await Linking.getInitialURL();
  if (url) {
    return appendOrigin(url, 'link');
  }
};

export const addEventListener = (handler: (url: string) => void) => {
  const subscription = Linking.addEventListener('url', ({url}) => {
    handler(appendOrigin(url, 'link'));
  });

  return () => subscription.remove();
};
