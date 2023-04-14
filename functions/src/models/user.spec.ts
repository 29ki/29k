import {mockFirebase} from 'firestore-jest-mock';
import {ROLE} from '../../../shared/src/types/User';

mockFirebase(
  {
    database: {
      users: [],
    },
  },
  {includeIdsInData: true, mutable: true},
);

import {firestore} from 'firebase-admin';
import {mockWhere} from 'firestore-jest-mock/mocks/firestore';
import {Timestamp} from 'firebase-admin/firestore';

import {getUser, getUsers, updateUser} from './user';

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
  {
    id: 'some-host-user-id',
    description: 'some other description',
    updatedAt: Timestamp.now(),
    role: ROLE.publicHost,
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

  describe('getUsers', () => {
    it('should get all users if no filter is provided', async () => {
      const users = await getUsers({});
      expect(users).toEqual([
        {
          id: 'some-user-id',
          description: 'some description',
          updatedAt: expect.any(Timestamp),
        },
        {
          id: 'some-other-user-id',
          description: 'some other description',
          updatedAt: expect.any(Timestamp),
        },
        {
          id: 'some-host-user-id',
          description: 'some other description',
          updatedAt: expect.any(Timestamp),
          role: ROLE.publicHost,
        },
      ]);
      expect(mockWhere).toHaveBeenCalledTimes(0);
    });

    it('should apply filters', async () => {
      await getUsers({role: ROLE.publicHost});
      expect(mockWhere).toHaveBeenCalledWith('role', '==', ROLE.publicHost);
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
