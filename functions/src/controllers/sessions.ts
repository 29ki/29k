import {Timestamp} from 'firebase-admin/firestore';
import dayjs from 'dayjs';
import {
  createSessionHostTransferLink,
  createSessionInviteLink,
} from '../models/dynamicLinks';
import {getUser} from './user';
import * as sessionModel from '../models/session';
import * as authModel from '../models/auth';
import * as userModel from '../models/user';
import * as dailyApi from '../lib/dailyApi';
import {
  CreateSessionType,
  SessionStateUpdateType,
  SessionType,
  UpdateSessionType,
} from '../../../shared/src/schemas/Session';
import {
  JoinSessionError,
  ValidateSessionError,
} from '../../../shared/src/errors/Session';
import {generateVerificationCode, removeEmpty} from '../lib/utils';
import {RequestError} from './errors/RequestError';
import {generateSessionToken} from '../lib/dailyUtils';
import {createRctUserId} from '../lib/id';
import {LiveSessionRecord} from '../models/types/types';
import {LiveSessionModel} from './types/types';
import {DEFAULT_LANGUAGE_TAG} from '../lib/i18n';

const mapSession = async (
  session: LiveSessionRecord,
): Promise<LiveSessionModel> => {
  try {
    // This can fail when host delete their account or
    // there is a network glitch.
    const hostProfile = await getUser(session.hostId);
    return {...session, hostProfile};
  } catch (error) {
    return {...session, hostProfile: null};
  }
};

const isSessionOpen = (session: LiveSessionRecord): boolean =>
  dayjs(session.closingTime.toDate()).isAfter(dayjs(Timestamp.now().toDate()));

const isUserAllowedToJoin = (session: LiveSessionRecord, userId: string) =>
  isSessionOpen(session) ||
  session.userIds.includes(userId) ||
  session.hostId === userId;

export const getSessionsByUserId = async (
  userId: string,
  exerciseId?: string,
  hostId?: string,
): Promise<LiveSessionModel[]> => {
  const sessions = await sessionModel.getSessionsByUserId(
    userId,
    exerciseId,
    hostId,
  );

  return Promise.all(
    sessions.filter(s => isUserAllowedToJoin(s, userId)).map(mapSession),
  );
};

export const getUpcomingPublicSessions = async (
  limit?: number,
): Promise<LiveSessionModel[]> => {
  const sessions = await sessionModel.getUpcomingPublicSessions(limit);

  return Promise.all(sessions.map(mapSession));
};

export const getSessionToken = async (
  userId: string,
  sessionId: LiveSessionModel['id'],
) => {
  const session = await sessionModel.getSessionById(sessionId);

  if (!session) {
    throw new RequestError(ValidateSessionError.notFound);
  }

  if (
    session.type === SessionType.private &&
    !session.userIds.find(id => id === userId)
  ) {
    throw new RequestError(ValidateSessionError.userNotFound);
  }

  const dailyUserId = createRctUserId(session.id, userId);

  return generateSessionToken(
    dailyUserId,
    session.dailyRoomName,
    session.hostId === userId,
    dayjs(session.startTime.toDate()).add(2, 'hours'),
  );
};

export const getSession = async (
  userId: string,
  sessionId: LiveSessionModel['id'],
) => {
  const session = await sessionModel.getSessionById(sessionId);

  if (!session) {
    throw new RequestError(ValidateSessionError.notFound);
  }

  if (
    session.type === SessionType.private &&
    !session.userIds.find(id => id === userId)
  ) {
    throw new RequestError(ValidateSessionError.userNotFound);
  }

  if (!isUserAllowedToJoin(session, userId)) {
    throw new RequestError(ValidateSessionError.userNotAuthorized);
  }

  return mapSession(session);
};

export const createSession = async (
  userId: string,
  {exerciseId, type, startTime, language}: CreateSessionType,
) => {
  const {displayName} = await authModel.getAuthUserInfo(userId);
  const expireDate = dayjs(startTime).add(2, 'hour');
  const dailyRoom = await dailyApi.createRoom(expireDate);
  let inviteCode = generateVerificationCode();

  while (await sessionModel.getSessionByInviteCode({inviteCode})) {
    inviteCode = generateVerificationCode();
  }

  const link = await createSessionInviteLink(
    inviteCode,
    exerciseId,
    displayName,
    language,
  );

  const session = await sessionModel.addSession({
    id: dailyRoom.id,
    dailyRoomName: dailyRoom.name,
    url: dailyRoom.url,
    language,
    exerciseId: exerciseId,
    link,
    type,
    startTime,
    inviteCode,
    interestedCount: 0,
    hostId: userId,
  });

  return await mapSession(session);
};

export const removeSession = async (
  userId: string,
  sessionId: LiveSessionModel['id'],
) => {
  const session = await sessionModel.getSessionById(sessionId);

  if (!session) return;

  if (userId !== session?.hostId) {
    throw new RequestError(ValidateSessionError.userNotAuthorized);
  }

  await Promise.all([
    dailyApi.deleteRoom(session.dailyRoomName),
    sessionModel.deleteSession(session.id),
  ]);
};

export const updateSession = async (
  userId: string,
  sessionId: LiveSessionModel['id'],
  data: Partial<UpdateSessionType>,
) => {
  const session = await sessionModel.getSessionById(sessionId);

  if (userId !== session?.hostId) {
    throw new RequestError(ValidateSessionError.userNotAuthorized);
  }

  if (
    data.startTime &&
    !dayjs(session.startTime.toDate()).isSame(data.startTime)
  ) {
    dailyApi.updateRoom(
      session.dailyRoomName,
      dayjs(data.startTime).add(2, 'hour'),
    );
  }

  await sessionModel.updateSession(sessionId, removeEmpty(data));
  const updatedSession = await sessionModel.getSessionById(sessionId);
  return updatedSession ? mapSession(updatedSession) : undefined;
};

export const updateInterestedCount = async (
  sessionId: LiveSessionModel['id'],
  increment: boolean,
) => {
  await sessionModel.updateInterestedCount(sessionId, increment);
};

export const updateSessionState = async (
  userId: string,
  sessionId: LiveSessionModel['id'],
  data: Partial<SessionStateUpdateType>,
) => {
  const session = await sessionModel.getSessionById(sessionId);
  const sessionState = await sessionModel.getSessionStateById(sessionId);

  if (!session || !sessionState) {
    throw new RequestError(ValidateSessionError.notFound);
  }

  if (userId !== session?.hostId) {
    throw new RequestError(ValidateSessionError.userNotAuthorized);
  }

  if (data.ended) {
    sessionModel.updateSession(sessionId, {ended: true});
  }

  if (data.completed) {
    const prop =
      session.type === SessionType.private
        ? 'hostedPrivateCount'
        : 'hostedPublicCount';
    userModel.incrementHostedCount(userId, prop);
  }

  if (data.started) {
    sessionModel.updateSession(sessionId, {
      closingTime: dayjs().add(5, 'minutes').toISOString(),
    });
  }

  await sessionModel.updateSessionState(sessionId, removeEmpty(data));
  const updatedState = await sessionModel.getSessionStateById(sessionId);
  return updatedState ? updatedState : undefined;
};

export const joinSession = async (
  userId: string,
  inviteCode: LiveSessionModel['inviteCode'],
) => {
  const session = await sessionModel.getSessionByInviteCode({
    inviteCode,
  });

  if (!session) {
    const unavailableSession = await sessionModel.getSessionByInviteCode({
      inviteCode,
      activeOnly: false,
    });

    if (unavailableSession) {
      throw new RequestError(JoinSessionError.notAvailable);
    } else {
      throw new RequestError(JoinSessionError.notFound);
    }
  }

  if (session.userIds.includes(userId)) {
    return mapSession(session);
  }

  await sessionModel.updateSession(session.id, {
    userIds: [...session.userIds, userId],
  });
  const updatedSession = await sessionModel.getSessionById(session.id);
  return updatedSession ? mapSession(updatedSession) : undefined;
};

export const getSessionByHostingCode = async (
  hostingCode: LiveSessionModel['hostingCode'],
) => {
  const session = await sessionModel.getSessionByHostingCode({
    hostingCode,
  });

  if (!session) {
    const unavailableSession = await sessionModel.getSessionByHostingCode({
      hostingCode,
      activeOnly: false,
    });

    if (unavailableSession) {
      throw new RequestError(JoinSessionError.notAvailable);
    } else {
      throw new RequestError(JoinSessionError.notFound);
    }
  }

  return mapSession(session);
};

export const createSessionHostingLink = async (
  userId: string,
  sessionId: LiveSessionModel['id'],
) => {
  const session = await sessionModel.getSessionById(sessionId);

  if (userId !== session?.hostId) {
    throw new RequestError(ValidateSessionError.userNotAuthorized);
  }

  if (session?.type !== SessionType.public) {
    throw new RequestError(JoinSessionError.notFound);
  }

  await sessionModel.updateSession(sessionId, {
    hostingCode: generateVerificationCode(),
  });
  const updatedSession = await sessionModel.getSessionById(sessionId);

  const {displayName} = await authModel.getAuthUserInfo(session.hostId);

  if (!updatedSession?.hostingCode) {
    throw new RequestError(JoinSessionError.notAvailable);
  }

  const link = await createSessionHostTransferLink(
    updatedSession.hostingCode,
    updatedSession.exerciseId,
    displayName || '',
    updatedSession.language || DEFAULT_LANGUAGE_TAG,
  );

  return link;
};

export const updateSessionHost = async (
  userId: string,
  sessionId: LiveSessionModel['id'],
  hostingCode: LiveSessionModel['hostingCode'],
) => {
  const session = await sessionModel.getSessionById(sessionId);

  if (hostingCode !== session?.hostingCode) {
    throw new RequestError(ValidateSessionError.userNotAuthorized);
  }

  await sessionModel.updateSession(sessionId, {
    hostingCode: undefined,
    hostId: userId,
  });
  const updatedSession = await sessionModel.getSessionById(sessionId);
  return updatedSession ? mapSession(updatedSession) : undefined;
};
