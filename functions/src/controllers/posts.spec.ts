import * as postsController from './posts';
import {
  addPost,
  getPostsByExerciseAndSharingId,
  getPostById,
  deletePost,
} from '../models/post';
import {getAuthUserInfo} from '../models/auth';
import {sendPostMessage} from '../models/slack';
import {Post, PostParams} from '../../../shared/src/types/Post';
import {PostError} from '../../../shared/src/errors/Post';
import {getSharingSlideById} from '../../../shared/src/content/exercise';
import {RequestError} from './errors/RequestError';
import {getExerciseById} from '../lib/exercise';
import {
  Exercise,
  ExerciseSlideSharingSlide,
} from '../../../shared/src/types/generated/Exercise';

jest.mock('../models/post');
jest.mock('../models/auth');
jest.mock('../lib/exercise');
jest.mock('../models/slack');
jest.mock('../../../shared/src/content/exercise');

const mockAddPost = jest.mocked(addPost);
const mockGetPostsByExerciseAndSharingId = jest.mocked(
  getPostsByExerciseAndSharingId,
);
const mockGetPostById = jest.mocked(getPostById);
const mockDeletePost = jest.mocked(deletePost);
const mockGetPublicUserInfo = jest.mocked(getAuthUserInfo);
const mockGetExerciseById = jest.mocked(getExerciseById);
const mockGetSharingSlideById = jest.mocked(getSharingSlideById);
const mockSendPostMessage = jest.mocked(sendPostMessage);

beforeEach(async () => {
  jest.clearAllMocks();
});

describe('posts - controller', () => {
  describe('addPost', () => {
    it('saves post with user set', async () => {
      mockGetExerciseById.mockReturnValueOnce({
        id: 'some-exercise-id',
        name: 'some exercise name',
      } as Exercise);
      mockGetSharingSlideById.mockReturnValueOnce({
        content: {heading: 'some question'},
      } as ExerciseSlideSharingSlide);
      mockAddPost.mockResolvedValueOnce({
        id: 'some-post-id',
        exerciseId: 'some-exercise-id',
        sharingId: 'some-sharing-id',
        text: 'some text',
        language: 'en',
        approved: true,
        userId: 'some-user-id',
      } as Post);

      await postsController.createPost(
        {
          exerciseId: 'some-exercise-id',
          sharingId: 'some-sharing-id',
          language: 'en',
          text: 'some text',
          anonymous: false,
        } as PostParams,
        'some-user-id',
      );

      expect(mockAddPost).toHaveBeenCalledTimes(1);
      expect(mockAddPost).toHaveBeenCalledWith({
        userId: 'some-user-id',
        approved: true,
        exerciseId: 'some-exercise-id',
        sharingId: 'some-sharing-id',
        language: 'en',
        text: 'some text',
      });
      expect(mockSendPostMessage).toHaveBeenCalledTimes(1);
      expect(mockSendPostMessage).toHaveBeenCalledWith(
        'some-post-id',
        'some exercise name',
        'some question',
        'some text',
        'en',
      );
    });

    it('saves post without user set', async () => {
      mockGetExerciseById.mockReturnValueOnce({
        id: 'some-exercise-id',
        name: 'some exercise name',
      } as Exercise);
      mockGetSharingSlideById.mockReturnValueOnce({
        content: {heading: 'some question'},
      } as ExerciseSlideSharingSlide);
      mockAddPost.mockResolvedValueOnce({
        id: 'some-post-id',
        exerciseId: 'some-exercise-id',
        sharingId: 'some-sharing-id',
        text: 'some text',
        language: 'en',
        approved: true,
      } as Post);
      await postsController.createPost(
        {
          exerciseId: 'some-exercise-id',
          sharingId: 'some-sharing-id',
          language: 'en',
          text: 'some text',
          anonymous: true,
        } as PostParams,
        'some-user-id',
      );

      expect(mockAddPost).toHaveBeenCalledTimes(1);
      expect(mockAddPost).toHaveBeenCalledWith({
        userId: null,
        approved: true,
        exerciseId: 'some-exercise-id',
        sharingId: 'some-sharing-id',
        language: 'en',
        text: 'some text',
      });
      expect(mockSendPostMessage).toHaveBeenCalledTimes(1);
      expect(mockSendPostMessage).toHaveBeenCalledWith(
        'some-post-id',
        'some exercise name',
        'some question',
        'some text',
        'en',
      );
    });
  });

  describe('getPostsByExerciseAndSharingId', () => {
    it('should return posts and add userProfile', async () => {
      mockGetPostsByExerciseAndSharingId.mockResolvedValueOnce([
        {
          id: 'some-post-id',
          userId: 'some-user-id',
        } as Post,
      ]);
      mockGetPublicUserInfo.mockResolvedValueOnce({
        uid: 'some-user-id',
        displayName: 'some name',
        photoURL: 'some-url',
      });

      const posts = await postsController.getPostsByExerciseAndSharingId(
        'some-exercise-id',
        'sharing-id',
        10,
      );

      expect(posts).toEqual([
        {
          id: 'some-post-id',
          userId: 'some-user-id',
          userProfile: {
            uid: 'some-user-id',
            displayName: 'some name',
            photoURL: 'some-url',
          },
        },
      ]);
    });

    it('should return posts and skip user profile if no userId', async () => {
      mockGetPostsByExerciseAndSharingId.mockResolvedValueOnce([
        {
          id: 'some-post-id',
        } as Post,
      ]);

      const posts = await postsController.getPostsByExerciseAndSharingId(
        'some-exercise-id',
        'sharing-id',
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
      mockGetPostsByExerciseAndSharingId.mockResolvedValueOnce([
        {
          id: 'some-post-id',
          userId: 'some-user-id',
        } as Post,
      ]);
      mockGetPublicUserInfo.mockRejectedValueOnce('some error');

      const posts = await postsController.getPostsByExerciseAndSharingId(
        'some-exercise-id',
        'sharing-id',
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
