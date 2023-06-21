import {
  Change,
  FirestoreEvent,
  onDocumentWritten,
  DocumentSnapshot,
} from 'firebase-functions/v2/firestore';
import {ROLE} from '../../../shared/src/schemas/User';
import {updateRole} from '../models/auth';

export const main = async (
  event: FirestoreEvent<Change<DocumentSnapshot> | undefined, {userId: string}>,
) => {
  const userId = event.params.userId;
  const dataBefore = event.data?.before.data();
  const dataAfter = event.data?.after.data();

  const role = dataAfter?.role === ROLE.publicHost ? ROLE.publicHost : null;

  if (dataBefore?.role !== dataAfter?.role) {
    await updateRole(userId, role);
  }
};

export const onUserUpdated = onDocumentWritten(
  {
    region: 'europe-west1',
    memory: '256MiB',
    maxInstances: 1024,
    minInstances: 1,
    document: 'users/{userId}',
  },
  main,
);
