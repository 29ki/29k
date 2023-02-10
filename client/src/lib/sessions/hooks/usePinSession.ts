import dayjs from 'dayjs';
import {useCallback, useMemo} from 'react';
import {LiveSession} from '../../../../../shared/src/types/Session';
import useUserState from '../../user/state/state';
import {updateInterestedCount} from '../api/session';
import useLogSessionMetricEvents from './useLogSessionMetricEvents';
import usePinnedSessions from './usePinnedSessions';

const usePinSession = (session: LiveSession) => {
  const pinnedSessions = usePinnedSessions();
  const setPinnedSessions = useUserState(state => state.setPinnedSessions);
  const logSessionMetricEvent = useLogSessionMetricEvents();

  const togglePinSession = useCallback(() => {
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
  }, [session, pinnedSessions, setPinnedSessions, logSessionMetricEvent]);

  const isSessionPinned = useMemo(
    () => Boolean(pinnedSessions.find(ps => ps.id === session.id)),
    [session, pinnedSessions],
  );

  return {togglePinSession, isSessionPinned};
};

export default usePinSession;
