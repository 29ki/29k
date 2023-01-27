import 'firebase-functions';
import {firestore} from 'firebase-admin';
import {Timestamp} from 'firebase-admin/firestore';

const EVENTS_COLLECTION = 'metrics-events';
//const USER_PROPERTIES_COLLECTION = 'metrics-user-properties';

type Property = boolean | number | string;
type Properties = {[key: string]: Property};

export const logEvent = async (
  userId: string,
  timestamp: Date,
  event: string,
  properties: Properties = {},
) => {
  const metricsCollection = firestore().collection(EVENTS_COLLECTION);

  await metricsCollection.add({
    userId,
    timestamp: Timestamp.fromDate(timestamp),
    event,
    properties,
  });
};
