import dayjs from 'dayjs';
import {useCallback, useMemo} from 'react';
import {LiveSession} from '../../../../../shared/src/types/Session';
import {updateInterestedCount} from '../api/session';
import useLogSessionMetricEvents from './useLogSessionMetricEvents';
import usePinnedSessions from './usePinnedSessions';
import useUserState from '../../user/state/state';
import useConfirmSessionReminder from './useConfirmSessionReminder';

const usePinSession = (session: LiveSession) => {
  const pinnedSessions = usePinnedSessions();
  const setPinnedSessions = useUserState(state => state.setPinnedSessions);
  const confirmToggleReminder = useConfirmSessionReminder(session);
  const logSessionMetricEvent = useLogSessionMetricEvents();

  const togglePinned = useCallback(() => {
    const now = dayjs();
    const currentPinnedSessions = pinnedSessions.filter(s =>
      now.isBefore(s.expires),
    );

    if (currentPinnedSessions.find(ps => ps.id === session.id)) {
      setPinnedSessions(
        currentPinnedSessions.filter(ps => ps.id !== session.id),
      );
      confirmToggleReminder(false);
      updateInterestedCount(session.id, false);
    } else {
      setPinnedSessions([
        ...currentPinnedSessions,
        {
          id: session.id,
          expires: dayjs(session.startTime).add(1, 'month').toDate(),
        },
      ]);
      confirmToggleReminder(true);
      updateInterestedCount(session.id, true);

      logSessionMetricEvent('Add Sharing Session To Interested', session);
    }
  }, [
    session,
    pinnedSessions,
    setPinnedSessions,
    confirmToggleReminder,
    logSessionMetricEvent,
  ]);

  const isPinned = useMemo(
    () => Boolean(pinnedSessions.find(ps => ps.id === session.id)),
    [session, pinnedSessions],
  );

  return {togglePinned, isPinned};
};

export default usePinSession;
