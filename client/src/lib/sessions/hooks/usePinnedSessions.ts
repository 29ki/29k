import dayjs from 'dayjs';
import {useCallback, useMemo} from 'react';
import {Session} from '../../../../../shared/src/types/Session';
import useLogSessionMetricEvents from './useLogSessionMetricEvents';
import useUserState from '../../user/state/state';
import useCurrentUserState from '../../user/hooks/useCurrentUserState';
import {updateInterestedCount} from '../api/session';

const usePinnedSessons = () => {
  const userState = useCurrentUserState();
  const setPinnedSessions = useUserState(state => state.setPinnedSessions);
  const logSessionMetricEvent = useLogSessionMetricEvents();

  const pinnedSessions = useMemo(
    () => userState?.pinnedSessions ?? [],
    [userState],
  );

  const togglePinSession = useCallback(
    (session: Session) => {
      const now = dayjs();
      const currentPinnedSessions = pinnedSessions.filter(s =>
        now.isBefore(s.expires),
      );

      if (currentPinnedSessions.find(ps => ps.id === session.id)) {
        setPinnedSessions(
          currentPinnedSessions.filter(ps => ps.id !== session.id),
        );
        updateInterestedCount(session.id, false);
      } else {
        setPinnedSessions([
          ...currentPinnedSessions,
          {
            id: session.id,
            expires: dayjs(session.startTime).add(1, 'month').toDate(),
          },
        ]);
        updateInterestedCount(session.id, true);
        logSessionMetricEvent('Add Sharing Session To Interested', session);
      }
    },
    [pinnedSessions, setPinnedSessions, logSessionMetricEvent],
  );

  const isSessionPinned = useCallback(
    (session: Session) =>
      Boolean(pinnedSessions.find(ps => ps.id === session.id)),
    [pinnedSessions],
  );

  return {
    pinnedSessions,
    togglePinSession,
    isSessionPinned,
  };
};

export default usePinnedSessons;
