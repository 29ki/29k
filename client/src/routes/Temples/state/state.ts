import {atom} from 'recoil';
import {Temple} from '../../../../../shared/src/types/Temple';

const NAMESPACE = 'temples';

export const isLoadingAtom = atom<boolean>({
  key: `${NAMESPACE}/isLoading`,
  default: false,
});

export const templesAtom = atom<Temple[] | null>({
  key: `${NAMESPACE}/temples`,
  default: null,
});
