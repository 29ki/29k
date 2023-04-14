import admin from 'firebase-admin';
import {getAuth} from 'firebase-admin/auth';
import {Timestamp} from 'firebase-admin/firestore';
import {ROLE} from '../../shared/src/types/User';

const {GOOGLE_APPLICATION_CREDENTIALS} = process.env;

if (!GOOGLE_APPLICATION_CREDENTIALS) {
  console.error(
    'GOOGLE_APPLICATION_CREDENTIALS env pointing to service-account.json is required',
  );
  process.exit(1);
}

admin.initializeApp();
const firestore = admin.firestore();

// Add emails to migrate here
const publicHostEmails = [];

(async () => {
  const usersCollection = firestore.collection('users');
  for (const email of publicHostEmails) {
    const user = await getAuth().getUserByEmail(email);
    const now = Timestamp.now();
    await usersCollection
      .doc(user.uid)
      .set({role: ROLE.publicHost, updatedAt: now}, {merge: true});

    console.log('Added user', user.displayName, 'as public host');
  }
})();
