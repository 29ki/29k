import request from 'supertest';
import Koa from 'koa';

import {postsRouter} from '.';
import createMockServer from '../lib/createMockServer';
import {createApiRouter} from '../../lib/routers';

import {
  createPost,
  deletePost,
  updatePost,
  getPostsByExerciseId,
} from '../../controllers/posts';

jest.mock('../../controllers/posts');

const mockCreatePost = jest.mocked(createPost);
const mockUpdatePost = jest.mocked(updatePost);
const mockDeletePost = jest.mocked(deletePost);
const mockGetPostsByExerciseId = jest.mocked(getPostsByExerciseId);

const router = createApiRouter();
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
      mockGetPostsByExerciseId.mockResolvedValueOnce([
        {
          id: 'some-id',
          exerciseId: 'some',
          text: 'some text',
          userId: 'some-user-id',
          userProfile: {displayName: 'some name', photoURL: 'some-url'},
          approved: true,
          language: 'en',
          createdAt: '2022-01-01T00:00:00Z',
          updatedAt: '2022-01-01T00:00:00Z',
        },
      ]);
      const response = await request(mockServer).get('/posts/some-exercise-id');

      expect(mockGetPostsByExerciseId).toHaveBeenCalledWith(
        'some-exercise-id',
        10,
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        {
          id: 'some-id',
          exerciseId: 'some',
          text: 'some text',
          userId: 'some-user-id',
          userProfile: {displayName: 'some name', photoURL: 'some-url'},
          approved: true,
          language: 'en',
          createdAt: '2022-01-01T00:00:00Z',
          updatedAt: '2022-01-01T00:00:00Z',
        },
      ]);
    });
  });

  describe('post', () => {
    it('should create post', async () => {
      const response = await request(mockServer).post('/posts').send({
        exerciseId: 'some-exercise-id',
        text: 'some text',
        public: true,
        language: 'en',
      });

      expect(mockCreatePost).toHaveBeenCalledWith(
        {
          exerciseId: 'some-exercise-id',
          text: 'some text',
          public: true,
          language: 'en',
        },
        'some-user-id',
      );
      expect(response.status).toBe(200);
    });
  });

  describe('put', () => {
    it('should update post with public flag', async () => {
      const response = await request(mockServer)
        .put('/posts/some-post-id')
        .send({
          public: false,
        });

      expect(mockUpdatePost).toHaveBeenCalledWith(
        'some-post-id',
        {
          public: false,
        },
        'some-user-id',
      );
      expect(response.status).toBe(200);
    });

    it('should update post with text', async () => {
      const response = await request(mockServer)
        .put('/posts/some-post-id')
        .send({
          text: 'some new text',
        });

      expect(mockUpdatePost).toHaveBeenCalledWith(
        'some-post-id',
        {
          text: 'some new text',
        },
        'some-user-id',
      );
      expect(response.status).toBe(200);
    });
  });

  describe('delete', () => {
    it('should delete post', async () => {
      const response = await request(mockServer).delete('/posts/some-post-id');

      expect(mockDeletePost).toHaveBeenCalledWith('some-post-id');
      expect(response.status).toBe(200);
    });
  });
});
