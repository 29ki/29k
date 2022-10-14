import {useCallback} from 'react';
import {Session} from '../../../../../shared/src/types/Session';
import * as sessionApi from '../../Sessions/api/session';

const useUpdateSession = (sessionId: Session['id']) => {
  const setStarted = useCallback(async () => {
    return sessionApi.updateSession(sessionId, {started: true});
  }, [sessionId]);

  const setEnded = useCallback(async () => {
    return sessionApi.updateSession(sessionId, {ended: true});
  }, [sessionId]);

  return {setStarted, setEnded};
};
export default useUpdateSession;
