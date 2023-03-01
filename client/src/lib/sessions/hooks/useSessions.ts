import {useCallback, useMemo, useState} from 'react';
import dayjs from 'dayjs';

import * as sessionsApi from '../api/sessions';
import * as sessionApi from '../api/session';

import useSessionsState from '../state/state';
import {LiveSession} from '../../../../../shared/src/types/Session';
import usePinnedSessions from './usePinnedSessions';
import useUser from '../../user/hooks/useUser';
import useOngoingSessions from '../../session/hooks/useOngoingSessions';

const useSessions = () => {
  const setIsLoading = useSessionsState(state => state.setIsLoading);
  const setSessions = useSessionsState(state => state.setSessions);
  const sessions = useSessionsState(state => state.sessions);
  const [ongoingSessions, setOngoingSessions] = useState<LiveSession[]>([]);
  const pinnedSessions = usePinnedSessions();
  const user = useUser();
  const {getOngoingSessions} = useOngoingSessions();

  const fetchSessions = useCallback(async () => {
    setIsLoading(true);
    setOngoingSessions(await getOngoingSessions());
    setSessions(await sessionsApi.fetchSessions());
    setIsLoading(false);
  }, [setIsLoading, setSessions, getOngoingSessions]);

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

  const upcomingSessions = useMemo(
    () =>
      (sessions ?? []).filter(
        s =>
          !ongoingSessions.find(o => o.id === s.id) && s.hostId !== user?.uid,
      ),
    [sessions, ongoingSessions, user],
  );

  const userHostedSessions = useMemo(
    () => (sessions ?? []).filter(s => s.hostId === user?.uid),
    [user, sessions],
  );

  const userPinnedSessions = useMemo(
    () =>
      (upcomingSessions ?? []).filter(s =>
        pinnedSessions.find(ps => ps.id === s.id),
      ),
    [upcomingSessions, pinnedSessions],
  );

  const unpinnedSessions = useMemo(
    () =>
      (upcomingSessions ?? []).filter(
        s => !pinnedSessions.find(ps => ps.id === s.id),
      ),
    [upcomingSessions, pinnedSessions],
  );

  return {
    fetchSessions,
    addSession,
    deleteSession,
    ongoingSessions,
    sessions: unpinnedSessions,
    pinnedSessions: userPinnedSessions,
    hostedSessions: userHostedSessions,
  };
};

export default useSessions;
