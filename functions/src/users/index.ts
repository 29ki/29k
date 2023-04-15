import {firestore} from 'firebase-functions';
import {userUpdatedHandler} from './handlers';

export const onUserUpdated = firestore
  .document('users/{userId}')
  .onWrite(async (change, context) => {
    userUpdatedHandler(
      context.params.userId,
      change.before.data(),
      change.after.data(),
    );
  });
