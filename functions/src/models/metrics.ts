import 'firebase-functions';
import {firestore} from 'firebase-admin';
import {Timestamp} from 'firebase-admin/firestore';

import {getData} from '../../../shared/src/modelUtils/firestore';
import {SessionMode} from '../../../shared/src/schemas/Session';
import {AddFeedbackBody, Feedback} from '../../../shared/src/types/Feedback';
import {LANGUAGE_TAG} from '../lib/i18n';

const EVENTS_COLLECTION = 'metricsEvents';
const USER_PROPERTIES_COLLECTION = 'metricsUserProperties';
const FEEDBACK_COLLECTION = 'metricsFeedback';

type Property = boolean | number | string;
type Properties = {[key: string]: Property};

export const logEvent = async (
  userId: string,
  timestamp: Date,
  event: string,
  properties: Properties = {},
) => {
  await firestore()
    .collection(EVENTS_COLLECTION)
    .add({
      userId,
      timestamp: Timestamp.fromDate(timestamp),
      event,
      properties,
    });
};

export const setUserProperties = async (
  userId: string,
  properties: Properties = {},
  once = false, // Overwrite existing properties?
) => {
  const collectionRef = firestore()
    .collection(USER_PROPERTIES_COLLECTION)
    .doc(userId);

  if (once) {
    // Does not overwrite already exising properties
    await firestore().runTransaction(async transaction => {
      const propertiesRef = await transaction.get(collectionRef);

      await transaction.set(
        collectionRef,
        {
          ...properties,
          ...propertiesRef.data(),
          updatedAt: Timestamp.now(),
        },
        {merge: true},
      );
    });
  } else {
    await collectionRef.set(
      {
        ...properties,
        updatedAt: Timestamp.now(),
      },
      {merge: true},
    );
  }
};

export const addFeedback = async (feedback: AddFeedbackBody) => {
  const feedbackDoc = await firestore()
    .collection(FEEDBACK_COLLECTION)
    .add({
      ...feedback,
      createdAt: Timestamp.now(),
    });

  return getData<Feedback>(await feedbackDoc.get());
};

export const getFeedbackByExercise = async (
  exerciseId: string,
  languages?: LANGUAGE_TAG[],
  mode?: SessionMode,
  approved?: boolean,
  limit?: number,
) => {
  let query = firestore()
    .collection(FEEDBACK_COLLECTION)
    .where('exerciseId', '==', exerciseId);

  if (languages) {
    query = query.where('language', 'in', languages);
  }

  if (mode) {
    query = query.where('sessionMode', '==', mode);
  }
  if (approved) {
    query = query.where('approved', '==', true);
  }
  query = query.orderBy('createdAt', 'desc');

  if (limit) {
    query = query.limit(limit);
  }

  const snapshot = await query.get();
  return snapshot.docs.map(getData<Feedback>);
};

export const getFeedbackBySessionIds = async (
  sessionIds: string[],
  limit?: number,
) => {
  let query = firestore()
    .collection(FEEDBACK_COLLECTION)
    .where('sessionId', 'in', sessionIds.slice(0, 30)) // Limit to 30 sessions to avoid Firestore query limits
    .where('host', '!=', true) // Only get feedback from participants, not hosts
    .orderBy('createdAt', 'desc');

  if (limit) {
    query = query.limit(limit);
  }

  const snapshot = await query.get();
  return snapshot.docs.map(getData<Feedback>);
};

export const setFeedbackApproval = async (
  feedbackId: string,
  approved: boolean,
) => {
  const now = Timestamp.now();
  await firestore()
    .collection(FEEDBACK_COLLECTION)
    .doc(feedbackId)
    .update({approved, updatedAt: now});
};
