import {useCallback} from 'react';
import {Session} from '../../../../../shared/src/types/Session';
import * as metrics from '../../metrics';
import useUser from '../../user/hooks/useUser';

type AllowedSharingEvents =
  | 'Create Sharing Session'
  | 'Join Sharing Session'
  | 'Add Sharing Session'
  | 'Add Sharing Session To Interested'
  | 'Add Sharing Session To Calendar'
  | 'Add Sharing Session Reminder'
  | 'Share Sharing Session';

const useLogSessionMetricEvents = () => {
  const user = useUser();

  return useCallback(
    (event: AllowedSharingEvents, session: Session) => {
      if (session?.id && user?.uid) {
        metrics.logEvent(event, {
          'Sharing Session ID': session.id,
          'Sharing Session Type': session.type,
          'Sharing Session Mode': session.mode,
          'Sharing Session Start Time': session.startTime,
          'Exercise ID': session.exerciseId,
          Host: user.uid === session.hostId,
          Language: session.language,
        });
      }
    },
    [user?.uid],
  );
};

export default useLogSessionMetricEvents;
