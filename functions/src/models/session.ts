import 'firebase-functions';
import {firestore} from 'firebase-admin';
import {Timestamp} from 'firebase-admin/firestore';
import dayjs from 'dayjs';

import {
  Session,
  SessionData,
  SessionType,
} from '../../../shared/src/types/Session';
import {getSession} from '../../../shared/src/modelUtils/session';
import {getData} from '../../../shared/src/modelUtils/firestore';
import {ExerciseStateUpdate} from '../api/sessions';
import {removeEmpty} from '../lib/utils';

const defaultExerciseState = {
  index: 0,
  playing: false,
  timestamp: Timestamp.now(),
};

const SESSIONS_COLLECTION = 'sessions';

export const getSessionById = async (id: Session['id']) => {
  const sessionDoc = await firestore()
    .collection(SESSIONS_COLLECTION)
    .doc(id)
    .get();

  if (!sessionDoc.exists) {
    return;
  }

  return getSession(getData<SessionData>(sessionDoc));
};

export const getSessionByInviteCode = async ({
  inviteCode,
  activeOnly = true,
}: {
  inviteCode: Session['inviteCode'];
  activeOnly?: boolean;
}) => {
  const query = firestore()
    .collection(SESSIONS_COLLECTION)
    .where('inviteCode', '==', inviteCode);

  const result = await (activeOnly
    ? query
        .where('ended', '==', false)
        .where(
          'startTime',
          '>',
          Timestamp.fromDate(
            dayjs(Timestamp.now().toDate()).subtract(30, 'minute').toDate(),
          ),
        )
    : query
  )
    .orderBy('startTime', 'asc')
    .get();

  if (!result.docs.length) {
    return;
  }

  return getSession(getData<SessionData>(result.docs[0]));
};

export const getSessions = async (userId: string) => {
  const sessionsCollection = firestore().collection(SESSIONS_COLLECTION);
  const snapshot = await sessionsCollection
    .where('ended', '==', false)
    .where(
      'startTime',
      '>',
      Timestamp.fromDate(
        dayjs(Timestamp.now().toDate()).subtract(30, 'minute').toDate(),
      ),
    )
    .where('userIds', 'array-contains-any', ['*', userId])
    .orderBy('startTime', 'asc')
    .get();

  return snapshot.docs.map(doc => getSession(getData<SessionData>(doc)));
};

export const addSession = async ({
  id,
  url,
  language,
  contentId,
  hostId,
  dailyRoomName,
  startTime,
  type,
  link,
  inviteCode,
}: Omit<
  Session,
  | 'exerciseState'
  | 'ended'
  | 'started'
  | 'userIds'
  | 'createdAt'
  | 'updatedAt'
  | 'hostProfile'
> & {
  dailyRoomName: string;
}) => {
  const now = Timestamp.now();
  const session = {
    id,
    url,
    language,
    contentId,
    hostId,
    dailyRoomName,
    type,
    link,
    inviteCode,
    startTime: Timestamp.fromDate(new Date(startTime)),
    exerciseState: defaultExerciseState,
    started: false,
    ended: false,
    createdAt: now,
    updatedAt: now,
    // '*' means session is available for everyone/public enables one single query on getSessions
    userIds: type === SessionType.private ? [hostId] : ['*'],
  };

  const sessionDoc = firestore().collection(SESSIONS_COLLECTION).doc(id);
  await sessionDoc.set(session);

  return getSession(getData<SessionData>(await sessionDoc.get()));
};

export const deleteSession = (id: Session['id']) =>
  firestore().collection(SESSIONS_COLLECTION).doc(id).delete();

export const updateSession = async (
  id: Session['id'],
  data: Partial<Session>,
) => {
  await firestore()
    .collection(SESSIONS_COLLECTION)
    .doc(id)
    .update({...data, updatedAt: Timestamp.now()});
};

export const updateExerciseState = async (
  id: Session['id'],
  data: Partial<ExerciseStateUpdate>,
) => {
  const sessionDocRef = firestore().collection(SESSIONS_COLLECTION).doc(id);
  await firestore().runTransaction(async transaction => {
    const session = getData<SessionData>(await transaction.get(sessionDocRef));
    const exerciseState = removeEmpty({
      ...session.exerciseState,
      ...data,
      timestamp: Timestamp.now(),
    });
    await transaction.update(sessionDocRef, {
      exerciseState,
      updatedAt: Timestamp.now(),
    });
  });
};
