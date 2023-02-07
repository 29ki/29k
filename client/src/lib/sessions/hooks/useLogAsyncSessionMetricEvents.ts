import {useCallback} from 'react';
import {AsyncSession} from '../../../../../shared/src/types/Session';
import * as metrics from '../../metrics';
import useUser from '../../user/hooks/useUser';

type AllowedSharingEvents =
  | 'Create Async Session'
  | 'Enter Intro Portal'
  | 'Completed Async Session'
  | 'Share Async Session';

const useLogAsyncSessionMetricEvents = () => {
  const user = useUser();

  return useCallback(
    (event: AllowedSharingEvents, session: AsyncSession) => {
      if (session?.id && user?.uid) {
        metrics.logEvent(event, {
          'Sharing Session ID': session.id,
          'Sharing Session Type': session.type,
          'Sharing Session Mode': 'async',
          'Sharing Session Start Time': session.startTime,
          'Exercise ID': session.exerciseId,
          Host: false,
          Language: session.language,
        });
      }
    },
    [user?.uid],
  );
};

export default useLogAsyncSessionMetricEvents;
