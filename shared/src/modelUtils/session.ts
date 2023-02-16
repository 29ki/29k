import {
  LiveSession,
  LiveSessionData,
  SessionState,
  SessionStateData,
} from '../types/Session';

export const getSession = (session: LiveSessionData): LiveSession => ({
  ...session,
  startTime: session.startTime.toDate().toISOString(),
  createdAt: session.createdAt.toDate().toISOString(),
  updatedAt: session.updatedAt.toDate().toISOString(),
});

export const getSessionState = (
  sessionState: SessionStateData,
): SessionState => ({
  ...sessionState,
  timestamp: sessionState.timestamp.toDate().toISOString(),
});
