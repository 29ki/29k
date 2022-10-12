import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {atom, selector} from 'recoil';

import {ROLES} from '../../../../../shared/src/types/User';

const NAMESPACE = 'User';

export const userAtom = atom<FirebaseAuthTypes.User | null>({
  key: NAMESPACE,
  default: null,
});

export const hasPublicHostRole = selector({
  key: `${NAMESPACE}/hasPublicHostRole`,
  get: async ({get}) => {
    const user = get(userAtom);
    const customClaim = await user?.getIdTokenResult(true);
    return customClaim?.claims.role === ROLES.publicHost;
  },
});
