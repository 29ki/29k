import {atom} from 'recoil';

const NAMESPACE = 'Sharing';

export type SharingContentState = {
  isLoading: boolean;
  isStarted: boolean;
  isJoined: boolean;
  active: boolean;
};

export const sharingContentStateAtom = atom<SharingContentState>({
  key: NAMESPACE,
  default: {
    active: false,
    isLoading: false,
    isStarted: false,
    isJoined: false,
  },
});
