import {atom, selectorFamily} from 'recoil';
import {Session} from '../../../../../shared/src/types/Session';

const NAMESPACE = 'sessions';

export const isLoadingAtom = atom<boolean>({
  key: `${NAMESPACE}/isLoading`,
  default: false,
});

export const sessionsAtom = atom<Session[] | null>({
  key: `${NAMESPACE}/sessions`,
  default: null,
});

export const sessionByIdSelector = selectorFamily({
  key: `${NAMESPACE}/sessionById`,
  get:
    (sessionId: string) =>
    ({get}) => {
      const sessions = get(sessionsAtom);
      if (sessions === null) {
        return null;
      }
      return sessions.find(t => t.id === sessionId);
    },
});
