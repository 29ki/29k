import * as postsController from './posts';
import {
  addPost,
  getPostsByExerciseAndSharingId,
  getPostById,
  deletePost,
} from '../models/post';
import {PostRecord} from '../models/types/types';
import {getAuthUserInfo} from '../models/auth';
import {sendPostMessage} from '../models/slack';
import {PostError} from '../../../shared/src/errors/Post';
import {getSharingSlideById} from '../../../shared/src/content/exercise';
import {RequestError} from './errors/RequestError';
import {getExerciseById} from '../lib/exercise';
import {
  Exercise,
  ExerciseSlideSharingSlide,
} from '../../../shared/src/types/generated/Exercise';
import {CreatePostType} from '../../../shared/src/schemas/Post';
import {classifyText} from '../models/openAi';
import {translate} from '../lib/translation';

jest.mock('../models/post');
jest.mock('../models/auth');
jest.mock('../models/slack');
jest.mock('../models/openAi');
jest.mock('../lib/exercise');
jest.mock('../lib/translation');
jest.mock('../../../shared/src/content/exercise');

const mockTranslate = jest.mocked(translate);
const mockClassifyText = jest.mocked(classifyText);

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
    beforeEach(() => {
      mockGetExerciseById.mockReturnValueOnce({
        id: 'some-exercise-id',
        name: 'some exercise name',
        card: {
          image: {
            source: 'some-image-url',
          },
        },
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
      } as PostRecord);
    });

    it('saves post with user set', async () => {
      await postsController.createPost(
        {
          exerciseId: 'some-exercise-id',
          sharingId: 'some-sharing-id',
          language: 'en',
          text: 'some text',
          anonymous: false,
        } as CreatePostType,
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
        classifications: undefined,
        translatedText: undefined,
      });
      expect(mockSendPostMessage).toHaveBeenCalledTimes(1);
      expect(mockSendPostMessage).toHaveBeenCalledWith(
        'some-post-id',
        true,
        'some-image-url',
        'some exercise name',
        'some question',
        'some text',
        undefined,
        undefined,
        'en',
      );
    });

    it('saves post without user set', async () => {
      await postsController.createPost(
        {
          exerciseId: 'some-exercise-id',
          sharingId: 'some-sharing-id',
          language: 'en',
          text: 'some text',
          anonymous: true,
        } as CreatePostType,
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
        classifications: undefined,
        translatedText: undefined,
      });
      expect(mockSendPostMessage).toHaveBeenCalledTimes(1);
      expect(mockSendPostMessage).toHaveBeenCalledWith(
        'some-post-id',
        true,
        'some-image-url',
        'some exercise name',
        'some question',
        'some text',
        undefined,
        undefined,
        'en',
      );
    });

    it('translates the text if language is not default', async () => {
      mockTranslate.mockResolvedValueOnce('some translated text');

      await postsController.createPost(
        {
          exerciseId: 'some-exercise-id',
          sharingId: 'some-sharing-id',
          language: 'sv',
          text: 'some text',
          anonymous: true,
        } as CreatePostType,
        'some-user-id',
      );

      expect(mockAddPost).toHaveBeenCalledTimes(1);
      expect(mockAddPost).toHaveBeenCalledWith({
        userId: null,
        approved: true,
        exerciseId: 'some-exercise-id',
        sharingId: 'some-sharing-id',
        language: 'sv',
        text: 'some text',
        classifications: undefined,
        translatedText: 'some translated text',
      });
      expect(mockSendPostMessage).toHaveBeenCalledTimes(1);
      expect(mockSendPostMessage).toHaveBeenCalledWith(
        'some-post-id',
        true,
        'some-image-url',
        'some exercise name',
        'some question',
        'some text',
        'some translated text',
        undefined,
        'en',
      );
    });

    it('classifies the text and disapproves', async () => {
      mockClassifyText.mockResolvedValueOnce([
        'Some classification',
        'Some other classification',
      ]);

      await postsController.createPost(
        {
          exerciseId: 'some-exercise-id',
          sharingId: 'some-sharing-id',
          language: 'en',
          text: 'some text',
          anonymous: true,
        } as CreatePostType,
        'some-user-id',
      );

      expect(mockAddPost).toHaveBeenCalledTimes(1);
      expect(mockAddPost).toHaveBeenCalledWith({
        userId: null,
        approved: false,
        exerciseId: 'some-exercise-id',
        sharingId: 'some-sharing-id',
        language: 'en',
        text: 'some text',
        classifications: ['Some classification', 'Some other classification'],
        translatedText: undefined,
      });
      expect(mockSendPostMessage).toHaveBeenCalledTimes(1);
      expect(mockSendPostMessage).toHaveBeenCalledWith(
        'some-post-id',
        false,
        'some-image-url',
        'some exercise name',
        'some question',
        'some text',
        undefined,
        ['Some classification', 'Some other classification'],
        'en',
      );
    });

    it('approves the post if classification is null', async () => {
      mockClassifyText.mockResolvedValueOnce(null);

      await postsController.createPost(
        {
          exerciseId: 'some-exercise-id',
          sharingId: 'some-sharing-id',
          language: 'en',
          text: 'some text',
          anonymous: true,
        } as CreatePostType,
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
        classifications: null,
        translatedText: undefined,
      });
      expect(mockSendPostMessage).toHaveBeenCalledTimes(1);
      expect(mockSendPostMessage).toHaveBeenCalledWith(
        'some-post-id',
        true,
        'some-image-url',
        'some exercise name',
        'some question',
        'some text',
        undefined,
        null,
        'en',
      );
    });

    it('continues even if translation and classification fails', async () => {
      mockTranslate.mockRejectedValueOnce(new Error('some translation error'));
      mockClassifyText.mockRejectedValueOnce(
        new Error('some classification error'),
      );

      await postsController.createPost(
        {
          exerciseId: 'some-exercise-id',
          sharingId: 'some-sharing-id',
          language: 'sv',
          text: 'some text',
          anonymous: true,
        } as CreatePostType,
        'some-user-id',
      );

      expect(mockAddPost).toHaveBeenCalledTimes(1);
      expect(mockAddPost).toHaveBeenCalledWith({
        userId: null,
        approved: true,
        exerciseId: 'some-exercise-id',
        sharingId: 'some-sharing-id',
        language: 'sv',
        text: 'some text',
        classifications: undefined,
        translatedText: undefined,
      });
      expect(mockSendPostMessage).toHaveBeenCalledTimes(1);
      expect(mockSendPostMessage).toHaveBeenCalledWith(
        'some-post-id',
        true,
        'some-image-url',
        'some exercise name',
        'some question',
        'some text',
        undefined,
        undefined,
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
        } as PostRecord,
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
        } as PostRecord,
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
          userProfile: null,
        },
      ]);
    });

    it('should return posts and allow user lookup to fail', async () => {
      mockGetPostsByExerciseAndSharingId.mockResolvedValueOnce([
        {
          id: 'some-post-id',
          userId: 'some-user-id',
        } as PostRecord,
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
          userProfile: null,
        },
      ]);
    });
  });

  describe('deletePost', () => {
    it('should delete post', async () => {
      mockGetPostById.mockResolvedValueOnce({
        userId: 'some-user-id',
      } as PostRecord);
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
