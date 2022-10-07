import {atom} from 'recoil';

const NAMESPACE = 'navigation';

export const navigationWithFadeAtom = atom<boolean>({
  key: `${NAMESPACE}/navigationWithFade`,
  default: false,
});
