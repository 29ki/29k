import {atom} from 'recoil';
import {Temple} from '../../api/temple';

const NAMESPACE = 'temples';

export type ContentState = {
  active: boolean;
  someContentId: string;
  someHighlightedElement: string;
  someIndex: number;
};

export const contentStateAtom = atom<ContentState | null>({
  key: NAMESPACE,
  default: null,
});

export const isLoadingAtom = atom<boolean>({
  key: `${NAMESPACE}/isLoading`,
  default: false,
});

export const templesAtom = atom<Temple[] | null>({
  key: `${NAMESPACE}/temples`,
  default: null,
});
