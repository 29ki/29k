import {map} from 'ramda';
import '../lib/sentry';
import {onSchedule, ScheduledEvent} from 'firebase-functions/v2/scheduler';
import {getAuth, UserRecord} from 'firebase-admin/auth';
import {getStorage} from 'firebase-admin/storage';
import config from '../lib/config';

const {BACKUPS_BUCKET: bucketName} = config;

// toJSON actually converts it to an object, not json
const toUserObject = (user: UserRecord) => user.toJSON();

const main = async (event: ScheduledEvent) => {
  const bucket = getStorage().bucket(`gs://${bucketName}/`);

  const listAllUsers = async (nextPageToken?: string): Promise<object[]> => {
    const {users, pageToken} = await getAuth().listUsers(1000, nextPageToken);

    const objects = map(toUserObject, users);
    const next = pageToken ? await listAllUsers(pageToken) : [];

    return [...objects, ...next];
  };

  const uploadBackup = (data: string) =>
    new Promise((resolve, reject) => {
      bucket
        .file(`auth/${event.scheduleTime}.json`)
        .createWriteStream()
        .on('error', reject)
        .on('finish', resolve)
        .end(data);
    });

  let users: object[] = [];
  users = await listAllUsers();

  const usersData = JSON.stringify(users);
  await uploadBackup(usersData);
};

export const auth = onSchedule(
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
  main,
);
