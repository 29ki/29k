import {useCallback} from 'react';
import {Session} from '../../../../../shared/src/types/Session';
import * as sessionApi from '../../Sessions/api/session';

const useJoinSession = () =>
  useCallback(async (inviteCode: Session['inviteCode']) => {
    return sessionApi.joinSession(inviteCode);
  }, []);

export default useJoinSession;
