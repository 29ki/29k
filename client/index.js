import {AppRegistry} from 'react-native';
import auth from '@react-native-firebase/auth';

import App from './src/App';

if (__DEV__) {
  auth().useEmulator('http://localhost:9099');
}

AppRegistry.registerComponent('twentyninek', () => App);
