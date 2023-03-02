import {firestore} from 'firebase-admin';
import {Timestamp} from 'firebase-admin/firestore';
import {omit} from 'ramda';
import {getData} from '../../../shared/src/modelUtils/firestore';

import {
  CompletedSessionsCount,
  CompletedSessionsCountData,
} from '../../../shared/src/types/CompletedSessions';

const COMPLETED_SESSIONS_COUNT_COLLECTION = 'completedSessionsCount';

export const getCompletedSessionsCount = async () => {
  const completedSessions = firestore().collection(
    COMPLETED_SESSIONS_COUNT_COLLECTION,
  );
  const snapshot = await completedSessions.get();

  return snapshot.docs
    .map(doc => getData<CompletedSessionsCount>(doc))
    .map(omit(['id', 'updatedAt']));
};

export const addCompletedSessionsCount = async (
  exerciseId: string,
  asyncCount: number,
  privateCount: number,
  publicCount: number,
) => {
  const completedSessionsRef = firestore()
    .collection(COMPLETED_SESSIONS_COUNT_COLLECTION)
    .doc(exerciseId);

  await firestore().runTransaction(async transaction => {
    const completedSession = getData<CompletedSessionsCountData>(
      await transaction.get(completedSessionsRef),
    );
    transaction.set(completedSessionsRef, {
      exerciseId,
      asyncCount: (completedSession?.asyncCount ?? 0) + asyncCount,
      privateCount: (completedSession?.privateCount ?? 0) + privateCount,
      publicCount: (completedSession?.publicCount ?? 0) + publicCount,
      updatedAt: Timestamp.now(),
    });
  });
};
