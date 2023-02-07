import * as postsController from './posts';
import {
  addPost,
  getPostsByExerciseId,
  getPostById,
  updatePost,
  deletePost,
} from '../models/post';
import {getPublicUserInfo} from '../models/user';
import {Post} from '../../../shared/src/types/Post';
import {PostError} from '../../../shared/src/errors/Post';
import {RequestError} from './errors/RequestError';

jest.mock('../models/post');
jest.mock('../models/user');

const mockAddPost = jest.mocked(addPost);
const mockGetPostsByExerciseId = jest.mocked(getPostsByExerciseId);
const mockGetPostById = jest.mocked(getPostById);
const mockUpdatePost = jest.mocked(updatePost);
const mockDeletePost = jest.mocked(deletePost);
const mockGetPublicUserInfo = jest.mocked(getPublicUserInfo);

beforeEach(async () => {
  jest.clearAllMocks();
});

describe('posts - controller', () => {
  describe('addPost', () => {
    it('saves post', async () => {
      await postsController.createPost('some-user-id', {
        exerciseId: 'some-exercise-id',
        language: 'en',
        text: 'some text',
      });

      expect(mockAddPost).toHaveBeenCalledWith({
        userId: 'some-user-id',
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

  describe('updatePost', () => {
    it('should update post', async () => {
      mockGetPostById.mockResolvedValueOnce({userId: 'some-user-id'} as Post);
      await postsController.updatePost('some-user-id', 'some-post-id', {
        text: 'some text',
      });

      expect(mockUpdatePost).toHaveBeenCalledWith('some-post-id', {
        text: 'some text',
      });
    });

    it('should not update post if no post was found', async () => {
      mockGetPostById.mockResolvedValueOnce(undefined);

      try {
        await postsController.updatePost('some-user-id', 'some-post-id', {
          text: 'some text',
        });
      } catch (error) {
        expect(error).toEqual(new RequestError(PostError.notFound));
      }
    });

    it('should not update post not belonging to user', async () => {
      mockGetPostById.mockResolvedValueOnce({
        userId: 'some-other-user-id',
      } as Post);

      try {
        await postsController.updatePost('some-user-id', 'some-post-id', {
          text: 'some text',
        });
      } catch (error) {
        expect(error).toEqual(new RequestError(PostError.userNotAuthorized));
      }
    });
  });

  describe('deletePost', () => {
    it('should delete post', async () => {
      mockGetPostById.mockResolvedValueOnce({userId: 'some-user-id'} as Post);
      await postsController.deletePost('some-user-id', 'some-post-id');

      expect(mockDeletePost).toHaveBeenCalledWith('some-post-id');
    });

    it('should not delete post if no post was found', async () => {
      mockGetPostById.mockResolvedValueOnce(undefined);

      try {
        await postsController.deletePost('some-user-id', 'some-post-id');
      } catch (error) {
        expect(error).toEqual(new RequestError(PostError.notFound));
      }
    });

    it('should not delete post not belonging to user', async () => {
      mockGetPostById.mockResolvedValueOnce({
        userId: 'some-other-user-id',
      } as Post);

      try {
        await postsController.deletePost('some-user-id', 'some-post-id');
      } catch (error) {
        expect(error).toEqual(new RequestError(PostError.userNotAuthorized));
      }
    });
  });
});
