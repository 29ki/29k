import admin from 'firebase-admin';
import {incrementHostedCount} from '../src/models/user';

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
  const users = await firestore.collection('users').get();
  for (const user of users.docs) {
    const sesssions = await sessionsCollection
      .where('hostId', '==', user.id)
      .get();
    for (const session of sesssions.docs) {
      const states = await session.ref.collection('state').get();
      if (!states.empty) {
        const state = states.docs.find(s => s.data().completed);
        if (state) {
          console.log(user.id, session?.data().type);
          await incrementHostedCount(
            user.id,
            session.data().type === 'public'
              ? 'hostedPublicCount'
              : 'hostedPrivateCount',
          );
        }
      }
    }
  }
})();
