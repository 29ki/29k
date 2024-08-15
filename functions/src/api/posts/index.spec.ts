import request from 'supertest';
import Koa from 'koa';
import {Timestamp} from 'firebase-admin/firestore';

import {postsRouter} from '.';
import createMockServer from '../lib/createMockServer';
import {createApiAuthRouter} from '../../lib/routers';

import {
  createPost,
  increasePostRelates,
  decreasePostRelates,
  getPosts,
} from '../../controllers/posts';

jest.mock('../../controllers/posts');

const mockCreatePost = jest.mocked(createPost);
const mockGetPosts = jest.mocked(getPosts);
const mockIncreasePostRelates = jest.mocked(increasePostRelates);
const mockDecreasePostRelates = jest.mocked(decreasePostRelates);

const router = createApiAuthRouter();
router.use('/posts', postsRouter.routes());
const mockServer = createMockServer(
  async (ctx: Koa.Context, next: Koa.Next) => {
    ctx.user = {
      id: 'some-user-id',
    };
    await next();
  },
  router.routes(),
  router.allowedMethods(),
);

beforeEach(async () => {
  jest.clearAllMocks();
});

afterAll(() => {
  mockServer.close();
});

describe('/api/posts', () => {
  describe('get', () => {
    it('should return posts', async () => {
      mockGetPosts.mockResolvedValueOnce([
        {
          id: 'some-id',
          exerciseId: 'some',
          sharingId: 'some-sharing-id',
          text: 'some text',
          userId: 'some-user-id',
          userProfile: {
            uid: 'some-user-id',
            displayName: 'some name',
            photoURL: 'some-url',
          },
          approved: true,
          language: 'en',
          createdAt: Timestamp.fromDate(new Date('2022-01-01T00:00:00Z')),
          updatedAt: Timestamp.fromDate(new Date('2022-01-01T00:00:00Z')),
        },
      ]);
      const response = await request(mockServer).get('/posts?limit=10');

      expect(mockGetPosts).toHaveBeenCalledWith(10, ['en']);
      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        {
          id: 'some-id',
          exerciseId: 'some',
          sharingId: 'some-sharing-id',
          text: 'some text',
          userId: 'some-user-id',
          userProfile: {
            uid: 'some-user-id',
            displayName: 'some name',
            photoURL: 'some-url',
          },
          relates: null,
          approved: true,
          language: 'en',
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      ]);
    });

    it('supports querying a specific language', async () => {
      mockGetPosts.mockResolvedValueOnce([
        {
          id: 'some-id',
          exerciseId: 'some',
          sharingId: 'some-sharing-id',
          text: 'some text',
          userId: 'some-user-id',
          userProfile: {
            uid: 'some-user-id',
            displayName: 'some name',
            photoURL: 'some-url',
          },
          approved: true,
          language: 'en',
          createdAt: Timestamp.fromDate(new Date('2022-01-01T00:00:00Z')),
          updatedAt: Timestamp.fromDate(new Date('2022-01-01T00:00:00Z')),
        },
      ]);
      const response = await request(mockServer).get(
        '/posts?limit=10&language=sv',
      );

      expect(mockGetPosts).toHaveBeenCalledWith(10, ['sv', 'en']);
      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        {
          id: 'some-id',
          exerciseId: 'some',
          sharingId: 'some-sharing-id',
          text: 'some text',
          userId: 'some-user-id',
          userProfile: {
            uid: 'some-user-id',
            displayName: 'some name',
            photoURL: 'some-url',
          },
          relates: null,
          approved: true,
          language: 'en',
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      ]);
    });
  });

  describe('post', () => {
    it('should create post', async () => {
      const response = await request(mockServer).post('/posts').send({
        exerciseId: 'some-exercise-id',
        sharingId: 'some-sharing-id',
        text: 'some text',
        anonymous: true,
      });

      expect(mockCreatePost).toHaveBeenCalledWith(
        {
          exerciseId: 'some-exercise-id',
          sharingId: 'some-sharing-id',
          text: 'some text',
          anonymous: true,
          language: 'en',
        },
        'some-user-id',
      );
      expect(response.status).toBe(200);
    });
  });

  describe('/:exerciseId/:sharingId', () => {
    describe('get', () => {
      it('should return posts', async () => {
        mockGetPosts.mockResolvedValueOnce([
          {
            id: 'some-id',
            exerciseId: 'some',
            sharingId: 'some-sharing-id',
            text: 'some text',
            userId: 'some-user-id',
            userProfile: {
              uid: 'some-user-id',
              displayName: 'some name',
              photoURL: 'some-url',
            },
            approved: true,
            language: 'en',
            createdAt: Timestamp.fromDate(new Date('2022-01-01T00:00:00Z')),
            updatedAt: Timestamp.fromDate(new Date('2022-01-01T00:00:00Z')),
          },
        ]);
        const response = await request(mockServer).get(
          '/posts/some-exercise-id/sharing-id?limit=10',
        );

        expect(mockGetPosts).toHaveBeenCalledWith(
          10,
          ['en'],
          'some-exercise-id',
          'sharing-id',
        );
        expect(response.status).toBe(200);
        expect(response.body).toEqual([
          {
            id: 'some-id',
            exerciseId: 'some',
            sharingId: 'some-sharing-id',
            text: 'some text',
            userId: 'some-user-id',
            userProfile: {
              uid: 'some-user-id',
              displayName: 'some name',
              photoURL: 'some-url',
            },
            relates: null,
            approved: true,
            language: 'en',
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          },
        ]);
      });

      it('supports querying a specific language', async () => {
        mockGetPosts.mockResolvedValueOnce([
          {
            id: 'some-id',
            exerciseId: 'some',
            sharingId: 'some-sharing-id',
            text: 'some text',
            userId: 'some-user-id',
            userProfile: {
              uid: 'some-user-id',
              displayName: 'some name',
              photoURL: 'some-url',
            },
            approved: true,
            language: 'en',
            createdAt: Timestamp.fromDate(new Date('2022-01-01T00:00:00Z')),
            updatedAt: Timestamp.fromDate(new Date('2022-01-01T00:00:00Z')),
          },
        ]);
        const response = await request(mockServer).get(
          '/posts/some-exercise-id/sharing-id?limit=10&language=sv',
        );

        expect(mockGetPosts).toHaveBeenCalledWith(
          10,
          ['sv', 'en'],
          'some-exercise-id',
          'sharing-id',
        );
        expect(response.status).toBe(200);
        expect(response.body).toEqual([
          {
            id: 'some-id',
            exerciseId: 'some',
            sharingId: 'some-sharing-id',
            text: 'some text',
            userId: 'some-user-id',
            userProfile: {
              uid: 'some-user-id',
              displayName: 'some name',
              photoURL: 'some-url',
            },
            relates: null,
            approved: true,
            language: 'en',
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          },
        ]);
      });
    });
  });

  describe(':postId/relate', () => {
    describe('post', () => {
      it('should increase post relates', async () => {
        const response = await request(mockServer)
          .post('/posts/some-post-id/relate')
          .send();

        expect(mockIncreasePostRelates).toHaveBeenCalledTimes(1);
        expect(mockIncreasePostRelates).toHaveBeenCalledWith('some-post-id');
        expect(response.status).toBe(200);
      });
    });

    describe('delete', () => {
      it('should decrease post relates', async () => {
        const response = await request(mockServer)
          .delete('/posts/some-post-id/relate')
          .send();

        expect(mockDecreasePostRelates).toHaveBeenCalledTimes(1);
        expect(mockDecreasePostRelates).toHaveBeenCalledWith('some-post-id');
        expect(response.status).toBe(200);
      });
    });
  });
});
