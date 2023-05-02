import {mockFirebase} from 'firestore-jest-mock';

mockFirebase(
  {
    database: {
      posts: [],
    },
  },
  {includeIdsInData: true, mutable: true},
);
import {
  mockWhere,
  mockOrderBy,
  mockLimit,
} from 'firestore-jest-mock/mocks/firestore';
import {firestore} from 'firebase-admin';
import {Timestamp} from 'firebase-admin/firestore';

import {addPost, getPostById, getPostsByExerciseAndSharingId} from './post';

const posts = [
  {
    id: 'some-post-id',
    exerciseId: 'some-exercise-id',
    sharingId: 'some-sharing-id',
    userId: 'some-user-id',
    language: 'en',
    approved: true,
    text: 'some sharing text',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    id: 'some-other-id',
    exerciseId: 'some-other-exercise-id',
    sharingId: 'some-other-sharing-id',
    userId: 'some-other-user-id',
    language: 'en',
    approved: true,
    text: 'some other sharing text',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
];

beforeEach(
  async () =>
    await Promise.all(
      posts.map(post => firestore().collection('posts').doc(post.id).set(post)),
    ),
);

afterEach(() => {
  jest.clearAllMocks();
});

describe('post model', () => {
  describe('getPostById', () => {
    it('should get a post by its id', async () => {
      const post = await getPostById('some-post-id');
      expect(post).toEqual({
        id: 'some-post-id',
        exerciseId: 'some-exercise-id',
        sharingId: 'some-sharing-id',
        userId: 'some-user-id',
        language: 'en',
        approved: true,
        text: 'some sharing text',
        createdAt: expect.any(Timestamp),
        updatedAt: expect.any(Timestamp),
      });
    });

    it('should return undefined if no post is found', async () => {
      const post = await getPostById('some-non-existing-post-id');
      expect(post).toBe(undefined);
    });
  });

  describe('getPostsByExerciseAndSharingId', () => {
    it('should filter by exerciseId, approved and public', async () => {
      await getPostsByExerciseAndSharingId(
        'some-exercise-id',
        'sharing-id',
        10,
      );
      expect(mockWhere).toHaveBeenCalledWith(
        'exerciseId',
        '==',
        'some-exercise-id',
      );
      expect(mockWhere).toHaveBeenCalledWith('sharingId', '==', 'sharing-id');
      expect(mockWhere).toHaveBeenCalledWith('approved', '==', true);
      expect(mockOrderBy).toHaveBeenCalledWith('createdAt', 'desc');
      expect(mockLimit).toHaveBeenCalledWith(10 * 2);
    });
  });

  describe('addPost', () => {
    it('should add and return post', async () => {
      const post = await addPost({
        exerciseId: 'some-exercise-id',
        sharingId: 'some-sharing-id',
        userId: 'some-user-id',
        approved: true,
        language: 'en',
        text: 'some text',
      });

      expect(post).toEqual({
        id: expect.any(String),
        exerciseId: 'some-exercise-id',
        sharingId: 'some-sharing-id',
        userId: 'some-user-id',
        approved: true,
        language: 'en',
        text: 'some text',
        createdAt: expect.any(Timestamp),
        updatedAt: expect.any(Timestamp),
      });
    });
  });
});
