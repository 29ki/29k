import {
  Change,
  FirestoreEvent,
  QueryDocumentSnapshot,
  onDocumentUpdated,
} from 'firebase-functions/v2/firestore';
import {ROLE} from '../../../shared/src/schemas/User';
import {updateRole} from '../models/auth';

export const main = async (
  event: FirestoreEvent<
    Change<QueryDocumentSnapshot> | undefined,
    {userId: string}
  >,
) => {
  const userId = event.params.userId;
  const dataBefore = event.data?.before.data();
  const dataAfter = event.data?.after.data();

  if (
    dataBefore?.role !== ROLE.publicHost &&
    dataAfter?.role === ROLE.publicHost
  ) {
    await updateRole(userId, ROLE.publicHost);
  } else if (
    dataBefore?.role === ROLE.publicHost &&
    dataAfter?.role !== ROLE.publicHost
  ) {
    await updateRole(userId, null);
  }
};

export const onUserUpdated = onDocumentUpdated(
  {
    region: 'europe-west1',
    memory: '256MiB',
    maxInstances: 1024,
    minInstances: 1,
    document: 'users/{userId}',
  },
  main,
);
