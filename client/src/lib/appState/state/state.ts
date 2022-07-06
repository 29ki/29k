import {atom} from 'recoil';

const NAMESPACE = 'AppState';

export const isColdStartedAtom = atom({
  key: `${NAMESPACE}/IsColdStarted`,
  default: true,
});
