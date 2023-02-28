import admin from 'firebase-admin';
import {Timestamp} from 'firebase-admin/firestore';
import dayjs from 'dayjs';

const {GOOGLE_APPLICATION_CREDENTIALS} = process.env;

if (!GOOGLE_APPLICATION_CREDENTIALS) {
  console.error(
    'GOOGLE_APPLICATION_CREDENTIALS env pointing to service-account.json is required',
  );
  process.exit(1);
}

admin.initializeApp();
const firestore = admin.firestore();

(async () => {
  const sessionsCollection = firestore.collection('sessions');
  const snapshot = await sessionsCollection.where('ended', '==', false).get();

  await Promise.all(
    snapshot.docs.map(async doc => {
      const {id, startTime} = doc.data();

      firestore
        .collection('sessions')
        .doc(id)
        .set(
          {
            closingTime: Timestamp.fromDate(
              dayjs(startTime.toDate()).add(30, 'minutes').toDate(),
            ),
          },
          {merge: true},
        );
    }),
  );

  console.log(
    `${snapshot.docs.length} session docs updated with closingTime (startTime + 5min).`,
  );
})();
