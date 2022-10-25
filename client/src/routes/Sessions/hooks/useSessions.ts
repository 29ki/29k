import {useCallback} from 'react';
import {useSetRecoilState} from 'recoil';
import dayjs from 'dayjs';

import * as sessionsApi from '../api/sessions';
import * as sessionApi from '../api/session';

import {isLoadingAtom, sessionsAtom} from '../state/state';
import {Session} from '../../../../../shared/src/types/Session';

const useSessions = () => {
  const setIsLoading = useSetRecoilState(isLoadingAtom);
  const setSessions = useSetRecoilState(sessionsAtom);

  const fetchSessions = useCallback(async () => {
    setIsLoading(true);
    setSessions(await sessionsApi.fetchSessions());
    setIsLoading(false);
  }, [setIsLoading, setSessions]);

  const addSession = useCallback(
    async ({
      contentId,
      type,
      startTime,
    }: {
      contentId: Session['contentId'];
      type: Session['type'];
      startTime: dayjs.Dayjs;
    }) => {
      await sessionApi.addSession({
        contentId,
        type,
        startTime: startTime.toJSON(),
      });
      fetchSessions();
    },
    [fetchSessions],
  );

  const deleteSession = useCallback(
    async (sessionId?: string) => {
      if (!sessionId) {
        return;
      }

      await sessionApi.deleteSession(sessionId);
      fetchSessions();
    },
    [fetchSessions],
  );

  return {
    fetchSessions,
    addSession,
    deleteSession,
  };
};

export default useSessions;
