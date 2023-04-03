import 'firebase-functions';
import {firestore} from 'firebase-admin';
import {Timestamp} from 'firebase-admin/firestore';
import dayjs from 'dayjs';

import {
  LiveSession,
  LiveSessionData,
  SessionMode,
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

const sessionClosingRange = () =>
  Timestamp.fromDate(
    dayjs(Timestamp.now().toDate()).subtract(30, 'minutes').toDate(),
  );

export const getSessionById = async (id: LiveSession['id']) => {
  const sessionDoc = await firestore()
    .collection(SESSIONS_COLLECTION)
    .doc(id)
    .get();

  if (!sessionDoc.exists) {
    return;
  }

  return getSession(getData<LiveSessionData>(sessionDoc));
};

export const getSessionStateById = async (id: LiveSession['id']) => {
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
  inviteCode: LiveSession['inviteCode'];
  activeOnly?: boolean;
}) => {
  const query = firestore()
    .collection(SESSIONS_COLLECTION)
    .where('inviteCode', '==', inviteCode);

  const result = await (activeOnly
    ? query
        .where('ended', '==', false)
        .orderBy('closingTime')
        .where('closingTime', '>', sessionClosingRange())
    : query
  )
    .orderBy('startTime', 'asc')
    .get();

  if (!result.docs.length) {
    return;
  }

  return getSession(getData<LiveSessionData>(result.docs[0]));
};

export const getSessions = async (
  userId?: string,
  exerciseId?: string,
  limit?: number,
) => {
  let query = firestore()
    .collection(SESSIONS_COLLECTION)
    .where('userIds', 'array-contains-any', userId ? ['*', userId] : ['*'])
    .where('ended', '==', false)
    .orderBy('closingTime')
    .where('closingTime', '>', sessionClosingRange())
    .orderBy('startTime', 'asc');

  if (exerciseId) {
    query = query.where('exerciseId', '==', exerciseId);
  }

  if (limit) {
    query = query.limit(limit);
  }

  const snapshot = await query.get();

  return snapshot.docs.map(doc => getSession(getData<LiveSessionData>(doc)));
};

export const addSession = async ({
  id,
  url,
  language,
  exerciseId,
  hostId,
  dailyRoomName,
  startTime,
  type,
  link,
  inviteCode,
  interestedCount,
}: Omit<
  LiveSession,
  'mode' | 'ended' | 'userIds' | 'createdAt' | 'updatedAt' | 'closingTime'
> & {
  dailyRoomName: string;
}) => {
  const now = Timestamp.now();
  const session = {
    id,
    url,
    language,
    exerciseId,
    hostId,
    dailyRoomName,
    type,
    mode: SessionMode.live,
    link,
    inviteCode,
    interestedCount,
    startTime: Timestamp.fromDate(new Date(startTime)),
    createdAt: now,
    updatedAt: now,
    ended: false,
    // '*' means session is available for everyone/public enables one single query on getSessions
    userIds: type === SessionType.private ? [hostId] : ['*'],
    closingTime: Timestamp.fromDate(
      dayjs(startTime).add(30, 'minutes').toDate(),
    ),
  };

  const sessionDoc = firestore().collection(SESSIONS_COLLECTION).doc(id);
  await sessionDoc.set(session);
  await sessionDoc
    .collection(SESSION_STATE_SUB_COLLECTION)
    .doc(id)
    .set({id, ...defaultSessionState});

  return getSession(getData<LiveSessionData>(await sessionDoc.get()));
};

export const deleteSession = async (id: LiveSession['id']) => {
  const sessionDoc = firestore().collection(SESSIONS_COLLECTION).doc(id);
  await sessionDoc.collection(SESSION_STATE_SUB_COLLECTION).doc(id).delete();
  return sessionDoc.delete();
};

export const updateSession = async (
  id: LiveSession['id'],
  data: Partial<LiveSession>,
) => {
  const updateValues = {
    ...data,
    ...(data.startTime
      ? {
          startTime: Timestamp.fromDate(new Date(data.startTime)),
          closingTime: Timestamp.fromDate(
            dayjs(data.startTime).add(30, 'minutes').toDate(),
          ),
        }
      : {}),
    ...(data.closingTime
      ? {closingTime: Timestamp.fromDate(new Date(data.closingTime))}
      : {}),
  };

  await firestore()
    .collection(SESSIONS_COLLECTION)
    .doc(id)
    .update({...updateValues, updatedAt: Timestamp.now()});
};

export const updateInterestedCount = async (
  id: LiveSession['id'],
  increment: boolean,
) => {
  const sessionRef = firestore().collection(SESSIONS_COLLECTION).doc(id);

  await firestore().runTransaction(async transaction => {
    const session = getData<LiveSessionData>(await transaction.get(sessionRef));
    transaction.update(sessionRef, {
      interestedCount: increment
        ? session.interestedCount + 1
        : Math.max(session.interestedCount - 1, 0),
    });
  });
};

export const updateSessionState = async (
  id: LiveSession['id'],
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
