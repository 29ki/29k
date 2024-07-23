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
  mockUpdate,
} from 'firestore-jest-mock/mocks/firestore';
import {firestore} from 'firebase-admin';
import {FieldValue, Timestamp} from 'firebase-admin/firestore';

import {
  addPost,
  decreasePostRelates,
  getPostById,
  getPosts,
  increasePostRelates,
} from './post';

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
    relates: 1337,
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

  describe('getPosts', () => {
    it('should filter approved and public and limit', async () => {
      await getPosts(10);
      expect(mockWhere).toHaveBeenCalledWith('approved', '==', true);
      expect(mockWhere).toHaveBeenCalledWith('language', 'in', ['en']);
      expect(mockOrderBy).toHaveBeenCalledWith('createdAt', 'desc');
      expect(mockLimit).toHaveBeenCalledWith(10 * 2);
    });

    it('should optionally filter by languages', async () => {
      await getPosts(10, ['sv']);
      expect(mockWhere).toHaveBeenCalledWith('approved', '==', true);
      expect(mockWhere).toHaveBeenCalledWith('language', 'in', ['sv']);
    });

    it('should optionally filter by exerciseId', async () => {
      await getPosts(10, undefined, 'some-exercise-id');
      expect(mockWhere).toHaveBeenCalledWith(
        'exerciseId',
        '==',
        'some-exercise-id',
      );
      expect(mockWhere).toHaveBeenCalledWith('approved', '==', true);
      expect(mockWhere).toHaveBeenCalledWith('language', 'in', ['en']);
    });

    it('should optionally filter by exerciseId and sharingId', async () => {
      await getPosts(10, undefined, 'some-exercise-id', 'sharing-id');
      await getPosts(10, undefined, 'some-exercise-id');
      expect(mockWhere).toHaveBeenCalledWith(
        'exerciseId',
        '==',
        'some-exercise-id',
      );
      expect(mockWhere).toHaveBeenCalledWith('sharingId', '==', 'sharing-id');
      expect(mockWhere).toHaveBeenCalledWith('approved', '==', true);
      expect(mockWhere).toHaveBeenCalledWith('language', 'in', ['en']);
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

  describe('increasePostRelates', () => {
    it('increase post relates', async () => {
      await increasePostRelates('some-post-id');

      expect(mockUpdate).toHaveBeenCalledTimes(1);
      expect(mockUpdate).toHaveBeenCalledWith({
        relates: FieldValue.increment(1),
        updatedAt: expect.any(Timestamp),
      });
    });
  });

  describe('decreasePostRelates', () => {
    it('decrease post relates', async () => {
      await decreasePostRelates('some-post-id');

      expect(mockUpdate).toHaveBeenCalledTimes(1);
      expect(mockUpdate).toHaveBeenCalledWith({
        relates: FieldValue.increment(-1),
        updatedAt: expect.any(Timestamp),
      });
    });
  });
});
