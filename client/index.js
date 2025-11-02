import {CLIENT_DEBUG} from 'config';
import debug from 'debug';
import {AppRegistry, LogBox} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

import App from './src/App';

debug.enable(CLIENT_DEBUG);
// %O doesn't output new lines for some reason
debug.formatters.p = value => JSON.stringify(value, null, 2);

LogBox.ignoreLogs([
  /*
    Styled components tries to enforce units, but that makes reusable style objects not compatible with react-native
    https://github.com/styled-components/styled-components/issues/835
    https://github.com/styled-components/css-to-react-native/issues/40
  */
  'to contain units',
  'to be unitless',
  /*
    react-native-background-timer is using a deprecated API
    https://github.com/ocetnik/react-native-background-timer/issues/366
  */
  'new NativeEventEmitter',
]);

if (__DEV__) {
  const HOST = process.env.IP_ADDRESS ?? 'localhost';
  auth().useEmulator(`http://${HOST}:9099`);
  firestore().useEmulator(HOST, 8080);
  storage().useEmulator(HOST, 9199);
}

AppRegistry.registerComponent('twentyninek', () => App);
