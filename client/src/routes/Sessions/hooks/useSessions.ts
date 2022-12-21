import {useCallback, useMemo} from 'react';
import dayjs from 'dayjs';

import * as sessionsApi from '../api/sessions';
import * as sessionApi from '../api/session';

import useSessionsState from '../state/state';
import {Session} from '../../../../../shared/src/types/Session';
import usePinnedSessons from '../../../lib/user/hooks/usePinnedSessions';

const useSessions = () => {
  const setIsLoading = useSessionsState(state => state.setIsLoading);
  const setSessions = useSessionsState(state => state.setSessions);
  const sessions = useSessionsState(state => state.sessions);
  const {pinnedSessions} = usePinnedSessons();

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

  const userPinnedSessions = useMemo(
    () =>
      (sessions ?? []).filter(s => pinnedSessions.find(ps => ps.id === s.id)),
    [sessions, pinnedSessions],
  );

  const unpinnedSessions = useMemo(
    () =>
      (sessions ?? []).filter(s => !pinnedSessions.find(ps => ps.id === s.id)),
    [sessions, pinnedSessions],
  );

  return {
    fetchSessions,
    addSession,
    deleteSession,
    sessions: unpinnedSessions,
    pinnedSessions: userPinnedSessions,
  };
};

export default useSessions;
