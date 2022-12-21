import dayjs from 'dayjs';
import {useCallback} from 'react';
import * as metrics from '../../../lib/metrics';
import {
  SharingSessionDuration,
  SharingSessionProperties,
} from '../../../lib/metrics/types/Properties';
import useUser from '../../../lib/user/hooks/useUser';
import useSessionState from '../state/state';
import useSessionSlideState from './useSessionSlideState';

type AllowedEvents =
  | 'Enter Changing Room'
  | 'Enter Intro Portal'
  | 'Start Sharing Session'
  | 'Enter Sharing Session'
  | 'Enter Outro Portal';

type GetSessionProperties = () =>
  | (SharingSessionProperties & SharingSessionDuration)
  | void;

const useLogSessionMetricEvents = () => {
  const user = useUser();
  const session = useSessionState(state => state.session);
  const slideState = useSessionSlideState();

  const getSessionMetricProperties = useCallback<GetSessionProperties>(
    () =>
      session?.id && user?.uid
        ? {
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
          }
        : undefined,
    [
      session?.id,
      session?.type,
      session?.startTime,
      session?.contentId,
      user?.uid,
      session?.hostId,
      session?.language,
    ],
  );

  const logSessionMetricEvent = useCallback(
    (event: AllowedEvents) => {
      const properties = getSessionMetricProperties();
      if (properties) {
        metrics.logEvent(event, properties);
      }
    },
    [getSessionMetricProperties],
  );

  const logLeaveSessionMetricEvent = useCallback(() => {
    const properties = getSessionMetricProperties();
    if (slideState?.current && slideState?.next && properties) {
      // Only log if Not on last slide
      metrics.logEvent('Leave Sharing Session', properties);
    }
  }, [getSessionMetricProperties, slideState]);

  const logCompleteSessionMetricEvent = useCallback(() => {
    const properties = getSessionMetricProperties();
    if (slideState?.current && !slideState?.next && properties) {
      // Only log if on last slide
      metrics.logEvent('Complete Sharing Session', properties);
    }
  }, [getSessionMetricProperties, slideState]);

  return {
    logSessionMetricEvent,
    logLeaveSessionMetricEvent,
    logCompleteSessionMetricEvent,
  };
};

export default useLogSessionMetricEvents;
