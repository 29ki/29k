import {Linking} from 'react-native';
import {appendOrigin} from './utils/url';


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
