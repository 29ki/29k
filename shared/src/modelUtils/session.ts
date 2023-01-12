import {
  Session,
  SessionData,
  SessionState,
  SessionStateData,
} from '../types/Session';

export const getSession = (session: SessionData): Session => ({
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
