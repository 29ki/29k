import admin from 'firebase-admin';

const DRY_RUN = true;

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
  const sessions = await sessionsCollection.where('language', '==', 'pt').get();

  for (const session of sessions.docs) {
    console.log('SESSION', session.id, session.data().language);

    if (!DRY_RUN) {
      await sessionsCollection.doc(session.id).update({
        language: 'pt-PT',
      });
    }
  }

  const metricsFeedbackCollection = firestore.collection('metricsFeedback');
  const metricsFeedback = await metricsFeedbackCollection
    .where('language', '==', 'pt')
    .get();

  for (const feedback of metricsFeedback.docs) {
    console.log('FEEDBACK', feedback.id, feedback.data().language);

    if (!DRY_RUN) {
      await metricsFeedbackCollection.doc(feedback.id).update({
        language: 'pt-PT',
      });
    }
  }

  const postsCollection = firestore.collection('posts');
  const posts = await postsCollection.where('language', '==', 'pt').get();

  for (const post of posts.docs) {
    console.log('POST', post.id, post.data().language);

    if (!DRY_RUN) {
      await postsCollection.doc(post.id).update({
        language: 'pt-PT',
      });
    }
  }
})();
