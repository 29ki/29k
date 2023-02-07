import * as postsController from './posts';
import {
  addPost,
  getPostsByExerciseId,
  getPostById,
  deletePost,
} from '../models/post';
import {getPublicUserInfo} from '../models/user';
import {Post, PostParams} from '../../../shared/src/types/Post';
import {PostError} from '../../../shared/src/errors/Post';
import {RequestError} from './errors/RequestError';

jest.mock('../models/post');
jest.mock('../models/user');

const mockAddPost = jest.mocked(addPost);
const mockGetPostsByExerciseId = jest.mocked(getPostsByExerciseId);
const mockGetPostById = jest.mocked(getPostById);
const mockDeletePost = jest.mocked(deletePost);
const mockGetPublicUserInfo = jest.mocked(getPublicUserInfo);

beforeEach(async () => {
  jest.clearAllMocks();
});

describe('posts - controller', () => {
  describe('addPost', () => {
    it('saves post with user set', async () => {
      await postsController.createPost(
        {
          exerciseId: 'some-exercise-id',
          language: 'en',
          text: 'some text',
          anonymous: false,
        } as PostParams,
        'some-user-id',
      );

      expect(mockAddPost).toHaveBeenCalledWith({
        userId: 'some-user-id',
        approved: true,
        exerciseId: 'some-exercise-id',
        language: 'en',
        text: 'some text',
      });
    });

    it('saves post without user set', async () => {
      await postsController.createPost(
        {
          exerciseId: 'some-exercise-id',
          language: 'en',
          text: 'some text',
          anonymous: true,
        } as PostParams,
        'some-user-id',
      );

      expect(mockAddPost).toHaveBeenCalledWith({
        userId: null,
        approved: true,
        exerciseId: 'some-exercise-id',
        language: 'en',
        text: 'some text',
      });
    });
  });

  describe('getPostsByExerciseId', () => {
    it('should return posts and add userProfile', async () => {
      mockGetPostsByExerciseId.mockResolvedValueOnce([
        {
          id: 'some-post-id',
          userId: 'some-user-id',
        } as Post,
      ]);
      mockGetPublicUserInfo.mockResolvedValueOnce({
        displayName: 'some name',
        photoURL: 'some-url',
      });

      const posts = await postsController.getPostsByExerciseId(
        'some-exercise-id',
        10,
      );

      expect(posts).toEqual([
        {
          id: 'some-post-id',
          userId: 'some-user-id',
          userProfile: {displayName: 'some name', photoURL: 'some-url'},
        },
      ]);
    });

    it('should return posts and skip user profile if no userId', async () => {
      mockGetPostsByExerciseId.mockResolvedValueOnce([
        {
          id: 'some-post-id',
        } as Post,
      ]);

      const posts = await postsController.getPostsByExerciseId(
        'some-exercise-id',
        10,
      );

      expect(mockGetPublicUserInfo).toHaveBeenCalledTimes(0);
      expect(posts).toEqual([
        {
          id: 'some-post-id',
        },
      ]);
    });

    it('should return posts and allow user lookup to fail', async () => {
      mockGetPostsByExerciseId.mockResolvedValueOnce([
        {
          id: 'some-post-id',
          userId: 'some-user-id',
        } as Post,
      ]);
      mockGetPublicUserInfo.mockRejectedValueOnce('some error');

      const posts = await postsController.getPostsByExerciseId(
        'some-exercise-id',
        10,
      );

      expect(mockGetPublicUserInfo).toHaveBeenCalledTimes(1);
      expect(posts).toEqual([
        {
          id: 'some-post-id',
          userId: 'some-user-id',
        },
      ]);
    });
  });

  describe('deletePost', () => {
    it('should delete post', async () => {
      mockGetPostById.mockResolvedValueOnce({userId: 'some-user-id'} as Post);
      await postsController.deletePost('some-post-id');

      expect(mockDeletePost).toHaveBeenCalledWith('some-post-id');
    });

    it('should not delete post if no post was found', async () => {
      mockGetPostById.mockResolvedValueOnce(undefined);

      try {
        await postsController.deletePost('some-post-id');
      } catch (error) {
        expect(error).toEqual(new RequestError(PostError.notFound));
      }
    });
  });
});
