import {useCallback} from 'react';
import * as metrics from '../../metrics';
import useUser from '../../user/hooks/useUser';
import useSessionState from '../state/state';

type AllowedSharingEvents = 'Create Async Post';

const useAsyncPostMetricEvents = () => {
  const user = useUser();
  const session = useSessionState(state => state.asyncSession);

  return useCallback(
    (event: AllowedSharingEvents, isPublic: boolean, isAnonymous: boolean) => {
      if (session?.id && user?.uid) {
        metrics.logEvent(event, {
          'Sharing Session ID': session.id,
          'Sharing Session Type': session.type,
          'Sharing Session Mode': session.mode,
          'Sharing Session Start Time': session.startTime,
          'Exercise ID': session.exerciseId,
          Host: false,
          Language: session.language,
          'Sharing Session Post Public': isPublic,
          'Sharing Session Post Anonymous': isAnonymous,
        });
      }
    },
    [
      user?.uid,
      session?.id,
      session?.type,
      session?.mode,
      session?.startTime,
      session?.exerciseId,
      session?.language,
    ],
  );
};

export default useAsyncPostMetricEvents;
