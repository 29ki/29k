import dayjs from 'dayjs';
import {createSessionLink} from '../models/dynamicLinks';
import * as sessionModel from '../models/session';
import * as dailyApi from '../lib/dailyApi';
import {Session} from '../../../shared/src/types/Session';
import {ExerciseStateUpdate, UpdateSession} from '../api/sessions';
import {generateVerificationCode, removeEmpty} from '../lib/utils';

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

  const link = await createSessionLink(
    inviteCode,
    contentId,
    startTime,
    language,
  );

  return sessionModel.addSession({
    id: dailyRoom.id,
    dailyRoomName: dailyRoom.name,
    url: dailyRoom.url,
    language,
    contentId,
    link,
    type,
    startTime,
    inviteCode,
    facilitator: userId,
  });
};

export const removeSession = async (
  userId: string,
  sessionId: Session['id'],
) => {
  const session = (await sessionModel.getSessionById(sessionId)) as Session & {
    dailyRoomName: string;
  };

  if (!session) return;

  if (userId !== session?.facilitator) {
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

  if (userId !== session?.facilitator) {
    throw new Error('user-unauthorized');
  }

  await sessionModel.updateSession(sessionId, removeEmpty(data));
  return sessionModel.getSessionById(sessionId);
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

  if (userId !== session?.facilitator) {
    throw new Error('user-unauthorized');
  }

  await sessionModel.updateExerciseState(sessionId, removeEmpty(data));
  return sessionModel.getSessionById(sessionId);
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
    return session;
  }

  await sessionModel.updateSession(session.id, {
    userIds: [...session.userIds, userId],
  });
  return sessionModel.getSessionById(session.id);
};
