import {mockFirebase} from 'firestore-jest-mock';

mockFirebase(
  {
    database: {
      completedSessionsCount: [],
    },
  },
  {includeIdsInData: true, mutable: true},
);

import {firestore} from 'firebase-admin';
import {Timestamp} from 'firebase-admin/firestore';

import {getCompletedSessionsCount} from './completedSessionsCount';

const completedSessionsCount = [
  {
    id: 'some-exercise-id',
    exerciseId: 'some-exercise-id',
    asyncCount: 0,
    privateCount: 1,
    publicCount: 1,
    updatedAt: Timestamp.now(),
  },
  {
    id: 'some-other-exercise-id',
    exerciseId: 'some-other-exercise-id',
    asyncCount: 0,
    privateCount: 2,
    publicCount: 2,
    updatedAt: Timestamp.now(),
  },
];

beforeEach(
  async () =>
    await Promise.all(
      completedSessionsCount.map(count =>
        firestore()
          .collection('completedSessionsCount')
          .doc(count.id)
          .set(count),
      ),
    ),
);

afterEach(() => {
  jest.clearAllMocks();
});

describe('completedSessionsCount model', () => {
  describe('getCompletedSessionsCount', () => {
    it('should get a completedSessionsCount', async () => {
      const completedSessionsCount = await getCompletedSessionsCount();
      expect(completedSessionsCount).toEqual([
        {
          exerciseId: 'some-exercise-id',
          asyncCount: 0,
          privateCount: 1,
          publicCount: 1,
        },
        {
          exerciseId: 'some-other-exercise-id',
          asyncCount: 0,
          privateCount: 2,
          publicCount: 2,
        },
      ]);
    });
  });
});
