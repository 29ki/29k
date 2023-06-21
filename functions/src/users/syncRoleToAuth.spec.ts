import {QueryDocumentSnapshot} from 'firebase-admin/firestore';
import {ROLE} from '../../../shared/src/schemas/User';
import {updateRole} from '../models/auth';
import {onUserUpdated} from './syncRoleToAuth';
import {Change} from 'firebase-functions/v2';
import {FirestoreEvent} from 'firebase-functions/v2/firestore';

jest.mock('../models/auth');

const mockUpdateRole = jest.mocked(updateRole);

beforeEach(() => {
  jest.clearAllMocks();
});

const createChangeEvent = (before: object, after: object) =>
  ({
    params: {userId: 'some-user-id'},
    data: {
      before: {data: () => before} as QueryDocumentSnapshot<object>,
      after: {
        data: () => after,
      } as QueryDocumentSnapshot<object>,
    } as Change<QueryDocumentSnapshot>,
  } as FirestoreEvent<
    Change<QueryDocumentSnapshot> | undefined,
    {userId: string}
  >);

describe('syncRoleToAuth', () => {
  it('should update the claims if public host role was added', async () => {
    onUserUpdated.run(createChangeEvent({}, {role: ROLE.publicHost}));
    expect(mockUpdateRole).toHaveBeenCalledWith(
      'some-user-id',
      ROLE.publicHost,
    );
  });

  it('should not update the claims if public host role was not updated', async () => {
    onUserUpdated.run(
      createChangeEvent({role: ROLE.publicHost}, {role: ROLE.publicHost}),
    );
    expect(mockUpdateRole).toHaveBeenCalledTimes(0);
  });

  it('should remove claims if public host role was removed', async () => {
    onUserUpdated.run(
      createChangeEvent({role: ROLE.publicHost}, {role: undefined}),
    );
    expect(mockUpdateRole).toHaveBeenCalledWith('some-user-id', null);
  });

  it('should not remove claims if public host was not updated', async () => {
    onUserUpdated.run(
      createChangeEvent(
        {description: 'some description'},
        {description: 'some updated description'},
      ),
    );
    expect(mockUpdateRole).toHaveBeenCalledTimes(0);
  });
});
