import admin from 'firebase-admin';
import {createSessionInviteLink} from '../src/models/dynamicLinks';
import {getUser} from '../src/controllers/user';

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
      const {id, exerciseId, inviteCode, hostId, language} = doc.data();

      const hostProfile = await getUser(hostId);
      const link = await createSessionInviteLink(
        inviteCode,
        exerciseId,
        hostProfile.displayName,
        language,
      );

      firestore.collection('sessions').doc(id).update({
        link,
      });
    }),
  );

  console.log(
    `${snapshot.docs.length} session docs were updated with a up to date invitation link.`,
  );
})();
