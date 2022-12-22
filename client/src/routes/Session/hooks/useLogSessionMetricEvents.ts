import dayjs from 'dayjs';
import {useCallback} from 'react';
import * as metrics from '../../../lib/metrics';
import useUser from '../../../lib/user/hooks/useUser';
import useSessionState from '../state/state';
import useSessionSlideState from './useSessionSlideState';

type AllowedSharingEvents =
  | 'Create Sharing Session'
  | 'Join Sharing Session'
  | 'Add Sharing Session'
  | 'Add Sharing Session To Interested'
  | 'Add Sharing Session To Calendar'
  | 'Add Sharing Session Reminder'
  | 'Share Sharing Session';

type AllowedInSharingEvents =
  | 'Enter Changing Room'
  | 'Enter Intro Portal'
  | 'Start Sharing Session'
  | 'Enter Sharing Session'
  | 'Leave Sharing Session'
  | 'Complete Sharing Session'
  | 'Enter Outro Portal';

const useLogSessionMetricEvents = () => {
  const user = useUser();
  const session = useSessionState(state => state.session);
  const slideState = useSessionSlideState();

  const logInSessionMetricEvent = useCallback(
    (event: AllowedInSharingEvents) => {
      if (session?.id && user?.uid) {
        metrics.logEvent(event, {
          'Sharing Session ID': session.id,
          'Sharing Session Type': session.type,
          'Sharing Session Start Time': session.startTime,
          'Sharing Session Duration': dayjs().diff(
            session.startTime,
            'seconds',
          ),
          'Exercise ID': session.contentId,
          Host: user.uid === session.hostId,
          Language: session.language,
        });
      }
    },
    [
      user?.uid,
      session?.id,
      session?.type,
      session?.startTime,
      session?.contentId,
      session?.hostId,
      session?.language,
    ],
  );

  const logSessionMetricEvent = useCallback(
    (event: AllowedSharingEvents) => {
      if (session?.id && user?.uid) {
        metrics.logEvent(event, {
          'Sharing Session ID': session.id,
          'Sharing Session Type': session.type,
          'Sharing Session Start Time': session.startTime,
          'Exercise ID': session.contentId,
          Host: user.uid === session.hostId,
          Language: session.language,
        });
      }
    },
    [
      user?.uid,
      session?.id,
      session?.type,
      session?.startTime,
      session?.contentId,
      session?.hostId,
      session?.language,
    ],
  );

  const conditionallyLogLeaveSessionMetricEvent = useCallback(() => {
    if (slideState?.current && slideState?.next) {
      // Only log if Not on last slide
      logInSessionMetricEvent('Leave Sharing Session');
    }
  }, [logInSessionMetricEvent, slideState]);

  const conditionallyLogCompleteSessionMetricEvent = useCallback(() => {
    if (slideState?.current && !slideState?.next) {
      // Only log if on last slide
      logInSessionMetricEvent('Complete Sharing Session');
    }
  }, [logInSessionMetricEvent, slideState]);

  return {
    logSessionMetricEvent,
    logInSessionMetricEvent,
    conditionallyLogLeaveSessionMetricEvent,
    conditionallyLogCompleteSessionMetricEvent,
  };
};

export default useLogSessionMetricEvents;
