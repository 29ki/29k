import {useCallback, useMemo} from 'react';
import dayjs from 'dayjs';

import * as sessionsApi from '../api/sessions';
import * as sessionApi from '../api/session';

import useSessionsState from '../state/state';
import {LiveSessionType} from '../../../../../shared/src/schemas/Session';
import usePinnedSessions from './usePinnedSessions';
import useUser from '../../user/hooks/useUser';

const useSessions = () => {
  const setSessions = useSessionsState(state => state.setSessions);
  const sessions = useSessionsState(state => state.sessions);
  const pinnedSessions = usePinnedSessions();
  const user = useUser();

  const fetchSessions = useCallback(async () => {
    setSessions(await sessionsApi.fetchSessions());
  }, [setSessions]);

  const addSession = useCallback(
    async ({
      exerciseId,
      type,
      startTime,
      language,
    }: {
      exerciseId: LiveSessionType['exerciseId'];
      type: LiveSessionType['type'];
      startTime: dayjs.Dayjs;
      language: LiveSessionType['language'];
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
    () => sessions.filter(session => session.hostId === user?.uid),
    [user, sessions],
  );

  const userPinnedSessions = useMemo(
    () =>
      sessions.filter(
        session =>
          pinnedSessions.find(
            pinnedSession => pinnedSession.id === session.id,
          ) && session.hostId !== user?.uid,
      ),
    [sessions, pinnedSessions, user],
  );

  return {
    fetchSessions,
    addSession,
    deleteSession,
    sessions,
    pinnedSessions: userPinnedSessions,
    hostedSessions: userHostedSessions,
  };
};

export default useSessions;
