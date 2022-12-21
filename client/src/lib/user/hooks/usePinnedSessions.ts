import dayjs from 'dayjs';
import {useCallback, useMemo} from 'react';
import {Session} from '../../../../../shared/src/types/Session';
import useUserState from '../state/state';
import useCurrentUserState from './useCurrentUserState';

const usePinnedSessons = () => {
  const userState = useCurrentUserState();
  const setPinnedSessions = useUserState(state => state.setPinnedSessions);

  const pinnedSessions = useMemo(
    () => userState?.pinnedSessions ?? [],
    [userState],
  );

  const togglePinnSession = useCallback(
    (session: Session) => {
      const now = dayjs();
      const currentPinnedSessions = pinnedSessions.filter(s =>
        now.isBefore(s.expires),
      );

      if (currentPinnedSessions.find(ps => ps.id === session.id)) {
        setPinnedSessions(
          currentPinnedSessions.filter(ps => ps.id !== session.id),
        );
      } else {
        setPinnedSessions([
          ...currentPinnedSessions,
          {
            id: session.id,
            expires: dayjs(session.startTime).add(1, 'month').toDate(),
          },
        ]);
      }
    },
    [pinnedSessions, setPinnedSessions],
  );

  const isSessionPinned = useCallback(
    (session: Session) =>
      Boolean(pinnedSessions.find(ps => ps.id === session.id)),
    [pinnedSessions],
  );

  return {
    pinnedSessions,
    togglePinnSession,
    isSessionPinned,
  };
};

export default usePinnedSessons;
