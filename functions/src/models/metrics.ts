import 'firebase-functions';
import {firestore} from 'firebase-admin';
import {Timestamp} from 'firebase-admin/firestore';
import {Feedback} from '../../../shared/src/types/Feedback';

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
) => {
  await firestore()
    .collection(USER_PROPERTIES_COLLECTION)
    .doc(userId)
    .set(
      {
        ...properties,
        updatedAt: Timestamp.now(),
      },
      {merge: true},
    );
};

export const addFeedback = async (feedback: Feedback) => {
  await firestore()
    .collection(FEEDBACK_COLLECTION)
    .add({
      ...feedback,
      createdAt: Timestamp.now(),
    });
};
