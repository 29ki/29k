import {useCallback} from 'react';
import dayjs from 'dayjs';

import * as sessionsApi from '../api/sessions';
import * as sessionApi from '../api/session';

import useSessionsState from '../state/state';
import {Session} from '../../../../../shared/src/types/Session';

const useSessions = () => {
  const setIsLoading = useSessionsState(state => state.setIsLoading);
  const setSessions = useSessionsState(state => state.setSessions);

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
      language,
    }: {
      contentId: Session['contentId'];
      type: Session['type'];
      startTime: dayjs.Dayjs;
      language: Session['language'];
    }) => {
      const session = await sessionApi.addSession({
        contentId,
        type,
        startTime: startTime.toJSON(),
        language,
      });
      fetchSessions();
      return session;
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
