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
  const feedbackCollection = firestore.collection('metricsFeedback');
  const snapshot = await feedbackCollection.get();

  await Promise.all(
    snapshot.docs.map(async doc => {
      await firestore.collection('metricsFeedback').doc(doc.id).update({
        language: 'en',
      });
    }),
  );

  console.log(`${snapshot.docs.length} feedbacks migrated`);
})();
