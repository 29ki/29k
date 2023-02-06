import dayjs from 'dayjs';
import {useCallback} from 'react';
import * as metrics from '../../metrics';
import useUser from '../../user/hooks/useUser';
import useSessionState from '../state/state';

type AllowedSharingEvents =
  | 'Enter Intro Portal'
  | 'Start Sharing Session'
  | 'Enter Sharing Session'
  | 'Leave Sharing Session'
  | 'Complete Sharing Session'
  | 'Enter Outro Portal';

const useAsyncSessionMetricEvents = () => {
  const user = useUser();
  const session = useSessionState(state => state.asyncSession);

  const logSessionMetricEvent = useCallback(
    (event: AllowedSharingEvents) => {
      if (session?.id && user?.uid) {
        metrics.logEvent(event, {
          'Sharing Session ID': session.id,
          'Sharing Session Type': session.type,
          'Sharing Session Mode': 'async',
          'Sharing Session Start Time': session.startTime,
          'Sharing Session Duration': dayjs().diff(
            session.startTime,
            'seconds',
          ),
          'Exercise ID': session.contentId,
          Host: false,
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
      session?.language,
    ],
  );

  return logSessionMetricEvent;
};

export default useAsyncSessionMetricEvents;
