import {atom, selectorFamily} from 'recoil';
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

export const templeByIdSelector = selectorFamily({
  key: `${NAMESPACE}/templeById`,
  get:
    (templeId: string) =>
    ({get}) => {
      const temples = get(templesAtom);
      if (temples === null) {
        return null;
      }
      return temples.find(t => t.id === templeId);
    },
});
