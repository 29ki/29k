import {mockFirebase} from 'firestore-jest-mock';

mockFirebase(
  {
    database: {
      users: [],
    },
  },
  {includeIdsInData: true, mutable: true},
);

import {firestore} from 'firebase-admin';
import {Timestamp} from 'firebase-admin/firestore';

import {getUser, updateUser} from './user';

const users = [
  {
    id: 'some-user-id',
    description: 'some description',
    updatedAt: Timestamp.now(),
  },
  {
    id: 'some-other-user-id',
    description: 'some other description',
    updatedAt: Timestamp.now(),
  },
];

beforeEach(
  async () =>
    await Promise.all(
      users.map(user => firestore().collection('users').doc(user.id).set(user)),
    ),
);

afterEach(() => {
  jest.clearAllMocks();
});

describe('user - model', () => {
  describe('getUser', () => {
    it('should get user', async () => {
      const user = await getUser('some-user-id');
      expect(user).toEqual({
        id: 'some-user-id',
        description: 'some description',
        updatedAt: expect.any(Timestamp),
      });
    });

    it('should get null if no user found', async () => {
      const user = await getUser('some-nonexisting-id');
      expect(user).toEqual(null);
    });
  });

  describe('updateUser', () => {
    it('should update user', async () => {
      await updateUser('some-user-id', {
        description: 'some updated description',
      });
      const user = await getUser('some-user-id');

      expect(user).toEqual({
        id: 'some-user-id',
        description: 'some updated description',
        updatedAt: expect.any(Timestamp),
      });
    });
  });
});
