import {AppRegistry} from 'react-native';
import '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import App from './src/App';

if (__DEV__) {
  auth().useEmulator('http://localhost:9099');
  firestore().useEmulator('localhost', 8080);
}

AppRegistry.registerComponent('twentyninek', () => App);
