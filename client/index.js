import {DEBUG} from 'config';
import debug from 'debug';
import {AppRegistry, LogBox} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

import App from './src/App';

debug.enable(DEBUG);
// %O doesn't output new lines for some reason
debug.formatters.p = value => JSON.stringify(value, null, 2);

LogBox.ignoreLogs([
  /*
    Styled components tries to enforce units, but that makes reusable style objects not compatible with react-native
    https://github.com/styled-components/styled-components/issues/835
    https://github.com/styled-components/css-to-react-native/issues/40
  */
  'contain units',
  'to be unitless',
  /*
    React Native Video v5 uses the deprecated ViewPropTypes. Remove this after upgrading to a stable v6
  */
  'ViewPropTypes',
]);

if (__DEV__) {
  const HOST = process.env.IP_ADDRESS ?? 'localhost';
  console.log(HOST);
  auth().useEmulator(`http://${HOST}:9099`);
  firestore().useEmulator(HOST, 8080);
  storage().useEmulator(HOST, 9199);
}

AppRegistry.registerComponent('twentyninek', () => App);
