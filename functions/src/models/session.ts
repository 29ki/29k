import 'firebase-functions';
import {firestore} from 'firebase-admin';
import {
  DocumentData,
  DocumentSnapshot,
  Timestamp,
} from 'firebase-admin/firestore';
import dayjs from 'dayjs';

import {
  ExerciseState,
  ExerciseStateData,
  Session,
  SessionData,
} from '../../../shared/src/types/Session';
import {ExerciseStateUpdate} from '../api/sessions';
import {removeEmpty} from '../lib/utils';

const defaultExerciseState = {
  index: 0,
  playing: false,
  timestamp: Timestamp.now(),
};

const getData = <T>(document: DocumentSnapshot<DocumentData>) => {
  const data = document.data();
  return data as T;
};

const getSessionExerciseState = (
  exerciseState: ExerciseStateData,
): ExerciseState => ({
  ...exerciseState,
  timestamp: exerciseState.timestamp.toDate().toISOString(),
});

const getSession = (session: SessionData): Session => ({
  ...session,
  exerciseState: getSessionExerciseState(session.exerciseState),
  startTime: session.startTime.toDate().toISOString(),
});

const SESSIONS_COLLECTION = 'sessions';

export const getSessionById = async (id: Session['id']) => {
  const sessionDoc = await firestore()
    .collection(SESSIONS_COLLECTION)
    .doc(id)
    .get();

  return getSession(getData<SessionData>(sessionDoc));
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
    .where('userIds', 'array-contains-any', ['all', userId])
    .orderBy('startTime', 'asc')
    .get();

  return snapshot.docs.map(doc => getSession(getData<SessionData>(doc)));
};

export const addSession = async ({
  id,
  url,
  contentId,
  facilitator,
  dailyRoomName,
  startTime,
  type,
  link,
  userIds,
}: Omit<Session, 'exerciseState' | 'ended' | 'started'> & {
  dailyRoomName: string;
}) => {
  const session = {
    id,
    url,
    contentId,
    facilitator,
    dailyRoomName,
    startTime: Timestamp.fromDate(new Date(startTime)),
    exerciseState: defaultExerciseState,
    type,
    link,
    userIds,
    started: false,
    ended: false,
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
  await firestore().collection(SESSIONS_COLLECTION).doc(id).update(data);
  return getSessionById(id);
};

export const updateExerciseState = async (
  id: Session['id'],
  data: ExerciseStateUpdate,
) => {
  const sessionDocRef = firestore().collection(SESSIONS_COLLECTION).doc(id);
  await firestore().runTransaction(async transaction => {
    const session = getData<SessionData>(await transaction.get(sessionDocRef));
    const exerciseState = removeEmpty({
      ...session.exerciseState,
      ...data,
      timestamp: Timestamp.now(),
    });
    await transaction.update(sessionDocRef, {exerciseState});
  });

  return getSessionById(id);
};
