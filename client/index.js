import {AppRegistry, LogBox} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import App from './src/App';

LogBox.ignoreLogs([
  /*
    Styled components tries to enforce units, but that makes reusable style objects not compatible with react-native
    https://github.com/styled-components/styled-components/issues/835
    https://github.com/styled-components/css-to-react-native/issues/40
  */
  'contain units',
  /*
    React Native Video v5 uses the deprecated ViewPropTypes. Remove this after upgrading to a stable v6
  */
  'ViewPropTypes',
]);

if (__DEV__) {
  auth().useEmulator('http://localhost:9099');
  firestore().useEmulator('localhost', 8080);
}

AppRegistry.registerComponent('twentyninek', () => App);
