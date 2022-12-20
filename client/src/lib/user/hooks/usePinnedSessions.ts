import dayjs from 'dayjs';
import {useCallback, useMemo} from 'react';
import {Session} from '../../../../../shared/src/types/Session';
import useSessionsState from '../../../routes/Sessions/state/state';
import useUserState from '../state/state';

const usePinnedSessons = () => {
  const sessions = useSessionsState(state => state.sessions);
  const user = useUserState(state => state.user);
  const userState = useUserState(state => state.userState);
  const setPinnedSessions = useUserState(state => state.setPinnedSessions);

  const pinnedSessions = useMemo(
    () => (user ? userState[user.uid]?.pinnedSessions ?? [] : []),
    [user, userState],
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

  const userPinnedSessions = useMemo(
    () =>
      (sessions ?? []).filter(s => pinnedSessions.find(ps => ps.id === s.id)),
    [sessions, pinnedSessions],
  );

  const otherSessions = useMemo(
    () =>
      (sessions ?? []).filter(s => !pinnedSessions.find(ps => ps.id === s.id)),
    [sessions, pinnedSessions],
  );

  return {
    sessions: otherSessions,
    pinnedSessions: userPinnedSessions,
    togglePinnSession,
    isSessionPinned,
  };
};

export default usePinnedSessons;
