import admin from 'firebase-admin';
import {createSessionInviteLink} from '../src/models/dynamicLinks';
import {getAuthUserInfo} from '../src/models/auth';
import {Timestamp} from 'firebase-admin/firestore';

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
  const snapshot = await sessionsCollection
    .where('ended', '==', false)
    .where('startTime', '>', Timestamp.now())
    .get();

  for (let doc of snapshot.docs) {
    const {id, exerciseId, inviteCode, hostId, language} = doc.data();
    let hostDisplayName: string;

    try {
      const host = await getAuthUserInfo(hostId);
      hostDisplayName = host?.displayName ?? '';
    } catch (err) {
      hostDisplayName = '';
    }

    const link = await createSessionInviteLink(
      inviteCode,
      exerciseId,
      hostDisplayName,
      language,
    );

    firestore.collection('sessions').doc(id).update({
      link,
    });
  }

  console.log(
    `${snapshot.docs.length} session docs were updated with a up to date invitation link.`,
  );
})();
