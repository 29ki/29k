import {Airbridge} from 'airbridge-react-native-sdk-restricted';
import EventEmitter from 'eventemitter3';
import {appendOrigin} from './utils/url';

/*
  Since Airbridge does not have getInitialURL but react-navigation requires
  the initial URL to be retreivable, we use this abstraction.
*/
let initialUrl: string | undefined;

const emitter = new EventEmitter();

Airbridge.setOnDeeplinkReceived(url => {
  if (emitter.listenerCount('deeplink') === 0) {
    // If no listeners are registered
    initialUrl = appendOrigin(url, 'link');
    return;
  }

  emitter.emit('deeplink', appendOrigin(url, 'link'));
});

export const getInitialURL = async () => initialUrl;

export const addEventListener = (handler: (url: string) => void) => {
  emitter.addListener('deeplink', handler);

  return () => {
    emitter.removeListener('deeplink', handler);
  };
};
