import dayjs from 'dayjs';
import {useCallback} from 'react';
import * as metrics from '../../../lib/metrics';
import useUser from '../../../lib/user/hooks/useUser';
import useSessionState from '../state/state';

type AllowedSharingEvents =
  | 'Enter Changing Room'
  | 'Enter Intro Portal'
  | 'Start Sharing Session'
  | 'Enter Sharing Session'
  | 'Leave Sharing Session'
  | 'Complete Sharing Session'
  | 'Enter Outro Portal';

const useLogInSessionMetricEvents = () => {
  const user = useUser();
  const liveSession = useSessionState(state => state.session);
  const asyncSession = useSessionState(state => state.asyncSession);

  const logLiveSessionMetricEvent = useCallback(
    (event: AllowedSharingEvents) => {
      if (liveSession?.id && user?.uid) {
        metrics.logEvent(event, {
          'Sharing Session ID': liveSession.id,
          'Sharing Session Type': liveSession.type,
          'Sharing Session Start Time': liveSession.startTime,
          'Sharing Session Duration': dayjs().diff(
            liveSession.startTime,
            'seconds',
          ),
          'Exercise ID': liveSession.contentId,
          Host: user.uid === liveSession?.hostId,
          Language: liveSession.language,
        });
      }
    },
    [
      user?.uid,
      liveSession?.id,
      liveSession?.type,
      liveSession?.startTime,
      liveSession?.hostId,
      liveSession?.contentId,
      liveSession?.language,
    ],
  );

  const logAsyncSessionMetricEvent = useCallback(
    (event: AllowedSharingEvents) => {
      if (asyncSession?.id && user?.uid) {
        metrics.logEvent(event, {
          'Sharing Session ID': asyncSession.id,
          'Sharing Session Type': asyncSession.type,
          'Sharing Session Start Time': asyncSession.startTime,
          'Sharing Session Duration': dayjs().diff(
            asyncSession.startTime,
            'seconds',
          ),
          'Exercise ID': asyncSession.contentId,
          Host: false,
          Language: asyncSession.language,
        });
      }
    },
    [
      user?.uid,
      asyncSession?.id,
      asyncSession?.type,
      asyncSession?.startTime,
      asyncSession?.contentId,
      asyncSession?.language,
    ],
  );

  return {logLiveSessionMetricEvent, logAsyncSessionMetricEvent};
};

export default useLogInSessionMetricEvents;
