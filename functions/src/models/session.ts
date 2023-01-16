import 'firebase-functions';
import {firestore} from 'firebase-admin';
import {Timestamp} from 'firebase-admin/firestore';
import dayjs from 'dayjs';

import {
  Session,
  SessionData,
  SessionStateData,
  SessionType,
} from '../../../shared/src/types/Session';
import {
  getSession,
  getSessionState,
} from '../../../shared/src/modelUtils/session';
import {getData} from '../../../shared/src/modelUtils/firestore';
import {SessionStateUpdate} from '../api/sessions';
import {removeEmpty} from '../lib/utils';

const defaultSessionState = {
  index: 0,
  playing: false,
  timestamp: Timestamp.now(),
  started: false,
  ended: false,
};

const SESSIONS_COLLECTION = 'sessions';
const SESSION_STATE_SUB_COLLECTION = 'state';

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

export const getSessionStateById = async (id: Session['id']) => {
  const sessionStateDoc = await firestore()
    .collection(SESSIONS_COLLECTION)
    .doc(id)
    .collection(SESSION_STATE_SUB_COLLECTION)
    .doc(id)
    .get();

  if (!sessionStateDoc.exists) {
    return;
  }

  return getSessionState(getData<SessionStateData>(sessionStateDoc));
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
}: Omit<Session, 'ended' | 'userIds' | 'createdAt' | 'updatedAt'> & {
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
    createdAt: now,
    updatedAt: now,
    ended: false,
    // '*' means session is available for everyone/public enables one single query on getSessions
    userIds: type === SessionType.private ? [hostId] : ['*'],
  };

  const sessionDoc = firestore().collection(SESSIONS_COLLECTION).doc(id);
  await sessionDoc.set(session);
  await sessionDoc
    .collection(SESSION_STATE_SUB_COLLECTION)
    .doc(id)
    .set({id, ...defaultSessionState});

  return getSession(getData<SessionData>(await sessionDoc.get()));
};

export const deleteSession = async (id: Session['id']) => {
  const sessionDoc = firestore().collection(SESSIONS_COLLECTION).doc(id);
  await sessionDoc.collection(SESSION_STATE_SUB_COLLECTION).doc(id).delete();
  return sessionDoc.delete();
};

export const updateSession = async (
  id: Session['id'],
  data: Partial<Session>,
) => {
  const updateValues = {
    ...data,
    ...(data.startTime
      ? {startTime: Timestamp.fromDate(new Date(data.startTime))}
      : {}),
  };

  await firestore()
    .collection(SESSIONS_COLLECTION)
    .doc(id)
    .update({...updateValues, updatedAt: Timestamp.now()});
};

export const updateSessionState = async (
  id: Session['id'],
  data: Partial<SessionStateUpdate>,
) => {
  const sessionStateDocRef = firestore()
    .collection(SESSIONS_COLLECTION)
    .doc(id)
    .collection(SESSION_STATE_SUB_COLLECTION)
    .doc(id);

  await firestore().runTransaction(async transaction => {
    const sessionState = getData<SessionStateData>(
      await transaction.get(sessionStateDocRef),
    );

    const updatedSessionState = removeEmpty({
      ...sessionState,
      ...data,
      timestamp: Timestamp.now(),
    });

    await transaction.update(sessionStateDocRef, updatedSessionState);
  });
};
