import {FirebaseAuthTypes} from '@react-native-firebase/auth';

import {atom} from 'recoil';

const NAMESPACE = 'User';

export const userAtom = atom<FirebaseAuthTypes.User | null>({
  key: NAMESPACE,
  default: null,
});
