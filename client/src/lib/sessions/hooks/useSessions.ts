import {useCallback, useMemo} from 'react';
import dayjs from 'dayjs';

import * as sessionsApi from '../api/sessions';
import * as sessionApi from '../api/session';

import useSessionsState from '../state/state';
import {LiveSession} from '../../../../../shared/src/types/Session';
import usePinnedSessons from './usePinnedSessions';
import useUser from '../../user/hooks/useUser';

const useSessions = () => {
  const setIsLoading = useSessionsState(state => state.setIsLoading);
  const setSessions = useSessionsState(state => state.setSessions);
  const sessions = useSessionsState(state => state.sessions);
  const {pinnedSessions} = usePinnedSessons();
  const user = useUser();

  const fetchSessions = useCallback(async () => {
    setIsLoading(true);
    setSessions(await sessionsApi.fetchSessions());
    setIsLoading(false);
  }, [setIsLoading, setSessions]);

  const addSession = useCallback(
    async ({
      exerciseId,
      type,
      startTime,
      language,
    }: {
      exerciseId: LiveSession['exerciseId'];
      type: LiveSession['type'];
      startTime: dayjs.Dayjs;
      language: LiveSession['language'];
    }) => {
      const session = await sessionApi.addSession({
        exerciseId,
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

  const userHostedSessions = useMemo(
    () => (sessions ?? []).filter(s => s.hostId === user?.uid),
    [user, sessions],
  );

  const userPinnedSessions = useMemo(
    () =>
      (sessions ?? []).filter(s =>
        pinnedSessions.find(ps => ps.id === s.id && s.hostId !== user?.uid),
      ),
    [sessions, pinnedSessions, user],
  );

  const unpinnedSessions = useMemo(
    () =>
      (sessions ?? []).filter(
        s =>
          !pinnedSessions.find(ps => ps.id === s.id) && s.hostId !== user?.uid,
      ),
    [sessions, pinnedSessions, user],
  );

  return {
    fetchSessions,
    addSession,
    deleteSession,
    sessions: unpinnedSessions,
    pinnedSessions: userPinnedSessions,
    hostedSessions: userHostedSessions,
  };
};

export default useSessions;
