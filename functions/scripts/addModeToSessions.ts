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
  const snapshot = await sessionsCollection.get();

  await Promise.all(
    snapshot.docs.map(async doc => {
      const {id} = doc.data();

      await firestore.collection('sessions').doc(id).update({
        mode: 'live',
      });
    }),
  );

  console.log(`${snapshot.docs.length} sessions migrated`);
})();
