import {GoogleAuth} from 'google-auth-library';
import {onSchedule, ScheduledEvent} from 'firebase-functions/v2/scheduler';
import {firestore} from 'firebase-admin';
import {getFirestore} from 'firebase-admin/firestore';
import {cronSentryErrorReporter} from '../lib/sentry.js';
import config from '../lib/config';

const googleAuth = new GoogleAuth();
const firestoreAdmin = new firestore.v1.FirestoreAdminClient();

const {BACKUPS_BUCKET} = config;
const IGNORED_COLLECTION_IDS: string[] = [];

const backup = async (event: ScheduledEvent) => {
  if (BACKUPS_BUCKET) {
    // Creating a path to the database
    // The db name seems to always be the same as the project id
    const projectId = await googleAuth.getProjectId();
    const formattedPath = firestoreAdmin.databasePath(projectId, '(default)');

    const collectionRefs = await getFirestore().listCollections();
    const collectionIds = collectionRefs
      .map(ref => ref.id)
      .filter(id => !IGNORED_COLLECTION_IDS.includes(id));

    await firestoreAdmin.exportDocuments({
      name: formattedPath,
      outputUriPrefix: `gs://${BACKUPS_BUCKET}/firestore/${event.scheduleTime}`,
      collectionIds: collectionIds,
    });
  }
};

export const firestoreBackup = onSchedule(
  {
    region: 'europe-west1',
    memory: '1GiB',
    schedule: 'every day 00:00',
    timeZone: 'Europe/Stockholm',
    maxInstances: 1,
    timeoutSeconds: 540, // maximum
    retryCount: 5, // maximum
    // use a longer backoff to allow to recover in case of failure
    minBackoffSeconds: 10,
    maxBackoffSeconds: 120,
  },
  cronSentryErrorReporter<ScheduledEvent>('firestore-backup', backup),
);
