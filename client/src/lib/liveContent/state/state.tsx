import {atom} from 'recoil';

const NAMESPACE = 'liveContent';

export type LiveContentState = {
  active: boolean;
  someContentId: string;
  someHighlightedElement: string;
  someIndex: number;
};

export const liveContentStateAtom = atom<LiveContentState>({
  key: NAMESPACE,
  default: {
    active: false,
    someContentId: "'content-id'",
    someHighlightedElement: "'highlighted-option'",
    someIndex: 3,
  },
});
