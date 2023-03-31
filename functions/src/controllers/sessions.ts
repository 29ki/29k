import {Timestamp} from 'firebase-admin/firestore';
import dayjs from 'dayjs';
import {createSessionInviteLink} from '../models/dynamicLinks';
import * as sessionModel from '../models/session';
import * as userModel from '../models/user';
import {getPublicUserInfo} from '../models/user';
import * as dailyApi from '../lib/dailyApi';
import {
  LiveSession,
  SessionState,
  SessionType,
} from '../../../shared/src/types/Session';
import {
  JoinSessionError,
  ValidateSessionError,
} from '../../../shared/src/errors/Session';
import {SessionStateUpdate, UpdateSession} from '../api/sessions';
import {generateVerificationCode, removeEmpty} from '../lib/utils';
import {RequestError} from './errors/RequestError';
import {generateSessionToken} from '../lib/dailyUtils';
import {createRctUserId} from '../lib/id';

const mapSession = async (session: LiveSession): Promise<LiveSession> => {
  return {...session, hostProfile: await getPublicUserInfo(session.hostId)};
};

const isSessionOpen = (session: LiveSession): boolean =>
  dayjs(session.closingTime).isAfter(dayjs(Timestamp.now().toDate()));

const isUserAllowedToJoin = (session: LiveSession, userId: string) =>
  isSessionOpen(session) ||
  session.userIds.includes(userId) ||
  session.hostId === userId;

export const getSessions = async (
  userId: string,
  exerciseId?: string,
): Promise<LiveSession[]> => {
  const sessions = await (exerciseId
    ? sessionModel.getPublicSessionsByExerciseId(userId, exerciseId)
    : sessionModel.getSessions(userId));

  return Promise.all(
    sessions.filter(s => isUserAllowedToJoin(s, userId)).map(mapSession),
  );
};

export const getSessionToken = async (
  userId: string,
  sessionId: LiveSession['id'],
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
    dayjs(session.startTime).add(2, 'hours'),
  );
};

export const getSession = async (
  userId: string,
  sessionId: LiveSession['id'],
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

  return mapSession(session);
};

export const createSession = async (
  userId: string,
  {
    exerciseId,
    type,
    startTime,
    language,
  }: Pick<LiveSession, 'exerciseId' | 'type' | 'startTime' | 'language'>,
) => {
  const {displayName} = await userModel.getPublicUserInfo(userId);
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
  sessionId: LiveSession['id'],
) => {
  const session = (await sessionModel.getSessionById(
    sessionId,
  )) as LiveSession & {
    dailyRoomName: string;
  };

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
  sessionId: LiveSession['id'],
  data: Partial<UpdateSession>,
) => {
  const session = (await sessionModel.getSessionById(
    sessionId,
  )) as LiveSession & {
    dailyRoomName: string;
  };

  if (userId !== session?.hostId) {
    throw new RequestError(ValidateSessionError.userNotAuthorized);
  }

  if (data.startTime && session.startTime !== data.startTime) {
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
  sessionId: LiveSession['id'],
  increment: boolean,
) => {
  await sessionModel.updateInterestedCount(sessionId, increment);
};

export const updateSessionState = async (
  userId: string,
  sessionId: LiveSession['id'],
  data: Partial<SessionStateUpdate>,
) => {
  const session = (await sessionModel.getSessionById(sessionId)) as LiveSession;
  const sessionState = (await sessionModel.getSessionStateById(
    sessionId,
  )) as SessionState;

  if (!session || !sessionState) {
    throw new RequestError(ValidateSessionError.notFound);
  }

  if (userId !== session?.hostId) {
    throw new RequestError(ValidateSessionError.userNotAuthorized);
  }

  if (data.ended) {
    sessionModel.updateSession(sessionId, {ended: true});
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
  inviteCode: LiveSession['inviteCode'],
) => {
  const session = (await sessionModel.getSessionByInviteCode({
    inviteCode,
  })) as LiveSession;

  if (!session) {
    const unavailableSession = (await sessionModel.getSessionByInviteCode({
      inviteCode,
      activeOnly: false,
    })) as LiveSession;

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
