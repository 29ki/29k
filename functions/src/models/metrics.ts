import 'firebase-functions';
import {firestore} from 'firebase-admin';
import {Timestamp} from 'firebase-admin/firestore';

const EVENTS_COLLECTION = 'metrics-events';
const USER_PROPERTIES_COLLECTION = 'metrics-user-properties';

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
