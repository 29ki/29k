import {atom} from 'recoil';

const NAMESPACE = 'liveContent';

export type LiveContentState = {
  active: boolean;
  someContentId: string;
  someHighlightedElement: string;
  someIndex: number;
};

export const liveContentStateAtom = atom<LiveContentState | null>({
  key: NAMESPACE,
  default: null,
});
