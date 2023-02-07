import admin from 'firebase-admin';

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
      const {id, started, ended, exerciseState} = doc.data();

      firestore
        .collection('sessions')
        .doc(id)
        .collection('state')
        .doc(id)
        .set({id, started, ended, ...exerciseState}, {merge: true});
    }),
  );

  console.log(
    `${snapshot.docs.length} session state docs created from old exercise states data.`,
  );
})();
