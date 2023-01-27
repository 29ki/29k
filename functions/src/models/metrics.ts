import {firestore} from 'firebase-admin';
import {Timestamp} from 'firebase-admin/firestore';

const METRICS_COLLECTION = 'metrics';
//const METRICS_USER_PROPERTIES = 'metrics-user-properties';

type Property = boolean | number | string;
type Properties = {[key: string]: Property};

export const logEvent = async (
  userId: string,
  timestamp: Date,
  event: string,
  properties?: Properties,
) => {
  const metricsCollection = firestore().collection(METRICS_COLLECTION);

  await metricsCollection.add({
    userId,
    timestamp: Timestamp.fromDate(timestamp),
    event,
    properties,
  });
};
