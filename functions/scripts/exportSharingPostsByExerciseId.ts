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
  const postsCollection = firestore.collection('posts');
  const snapshot = await postsCollection
    .where('exerciseId', '==', '1a53e633-6916-4fea-a072-977c4b215288')
    .get();

  const posts = snapshot.docs
    .map(doc => doc.data())
    .filter(({approved}) => approved);

  posts.forEach(({text}) => {
    console.log(`"${text.replace(/[\r\n]/g, ' ')}"`);
  });

  console.log(`Posts: ${posts.length}`);
})();
