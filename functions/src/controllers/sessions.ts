import dayjs from 'dayjs';
import {createSessionInviteLink} from '../models/dynamicLinks';
import * as sessionModel from '../models/session';
import * as userModel from '../models/user';
import {getPublicUserInfo} from '../models/user';
import * as dailyApi from '../lib/dailyApi';
import {
  Session,
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

const mapSession = async (session: Session): Promise<Session> => {
  return {...session, hostProfile: await getPublicUserInfo(session.hostId)};
};

export const getSessions = async (userId: string): Promise<Session[]> => {
  const sessions = await sessionModel.getSessions(userId);
  return Promise.all(sessions.map(mapSession));
};

export const getSessionToken = async (
  userId: string,
  sessionId: Session['id'],
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

  return generateSessionToken(
    session.dailyRoomName,
    session.hostId === userId,
    dayjs(session.startTime).add(2, 'hours'),
  );
};

export const createSession = async (
  userId: string,
  {
    contentId,
    type,
    startTime,
    language,
  }: Pick<Session, 'contentId' | 'type' | 'startTime' | 'language'>,
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
    contentId,
    displayName,
    language,
  );

  const session = await sessionModel.addSession({
    id: dailyRoom.id,
    dailyRoomName: dailyRoom.name,
    url: dailyRoom.url,
    language,
    contentId,
    link,
    type,
    startTime,
    inviteCode,
    hostId: userId,
  });

  return await mapSession(session);
};

export const removeSession = async (
  userId: string,
  sessionId: Session['id'],
) => {
  const session = (await sessionModel.getSessionById(sessionId)) as Session & {
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
  sessionId: Session['id'],
  data: Partial<UpdateSession>,
) => {
  const session = (await sessionModel.getSessionById(sessionId)) as Session & {
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

export const updateSessionState = async (
  userId: string,
  sessionId: Session['id'],
  data: Partial<SessionStateUpdate>,
) => {
  const session = (await sessionModel.getSessionById(sessionId)) as Session;
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

  await sessionModel.updateSessionState(sessionId, removeEmpty(data));
  const updatedState = await sessionModel.getSessionStateById(sessionId);
  return updatedState ? updatedState : undefined;
};

export const joinSession = async (
  userId: string,
  inviteCode: Session['inviteCode'],
) => {
  const session = (await sessionModel.getSessionByInviteCode({
    inviteCode,
  })) as Session;

  if (!session) {
    const unavailableSession = (await sessionModel.getSessionByInviteCode({
      inviteCode,
      activeOnly: false,
    })) as Session;

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
