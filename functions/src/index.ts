import * as admin from 'firebase-admin';
import * as firestore from 'firebase-admin/firestore';

/* This should improve cold starts, no emulator support yet though
   https://github.com/firebase/firebase-admin-node/pull/1901 */
firestore.initializeFirestore(admin.initializeApp(), {
  preferRest: !process.env.FUNCTIONS_EMULATOR,
});

export * from './api';
export * from './slack';
export * from './metrics';
export * from './users';
export * from './calendar';
export * from './backups';
