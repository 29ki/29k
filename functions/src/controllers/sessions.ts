import dayjs from 'dayjs';
import {createSessionInviteLink} from '../models/dynamicLinks';
import * as sessionModel from '../models/session';
import {getPublicUserInfo} from '../models/user';
import * as dailyApi from '../lib/dailyApi';
import {Session} from '../../../shared/src/types/Session';
import {ExerciseStateUpdate, UpdateSession} from '../api/sessions';
import {generateVerificationCode, removeEmpty} from '../lib/utils';

const mapSession = async (session: Session) => {
  return {...session, hostProfile: await getPublicUserInfo(session.hostId)};
};

export const getSessions = async (userId: string): Promise<Array<Session>> => {
  const sessions = await sessionModel.getSessions(userId);
  return Promise.all(sessions.map(mapSession));
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
  const dailyRoom = await dailyApi.createRoom(dayjs(startTime).add(2, 'hour'));
  let inviteCode = generateVerificationCode();

  while (await sessionModel.getSessionByInviteCode(inviteCode)) {
    inviteCode = generateVerificationCode();
  }

  const link = await createSessionInviteLink(
    inviteCode,
    contentId,
    startTime,
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
    throw new Error('user-unauthorized');
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
  const session = (await sessionModel.getSessionById(sessionId)) as Session;

  if (userId !== session?.hostId) {
    throw new Error('user-unauthorized');
  }

  await sessionModel.updateSession(sessionId, removeEmpty(data));
  const updatedSession = await sessionModel.getSessionById(sessionId);
  return updatedSession ? mapSession(updatedSession) : undefined;
};

export const updateExerciseState = async (
  userId: string,
  sessionId: Session['id'],
  data: Partial<ExerciseStateUpdate>,
) => {
  const session = (await sessionModel.getSessionById(sessionId)) as Session;

  if (!session) {
    throw new Error('session-not-found');
  }

  if (userId !== session?.hostId) {
    throw new Error('user-unauthorized');
  }

  await sessionModel.updateExerciseState(sessionId, removeEmpty(data));
  const updatedSession = await sessionModel.getSessionById(sessionId);
  return updatedSession ? mapSession(updatedSession) : undefined;
};

export const joinSession = async (
  userId: string,
  inviteCode: Session['inviteCode'],
) => {
  const session = (await sessionModel.getSessionByInviteCode(
    inviteCode,
  )) as Session;

  if (!session) {
    throw new Error('session-not-found');
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
