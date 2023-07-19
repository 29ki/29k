import {PostError} from '../../../shared/src/errors/Post';
import {getSharingSlideById} from '../../../shared/src/content/exercise';
import {getExerciseById} from '../lib/exercise';
import * as postModel from '../models/post';
import {sendPostMessage} from '../models/slack';
import {getAuthUserInfo} from '../models/auth';
import {RequestError} from './errors/RequestError';
import {CreatePostType} from '../../../shared/src/schemas/Post';
import {omit} from 'ramda';
import {classifyText} from '../models/openAi';
import {translate} from '../lib/translation';
import {DEFAULT_LANGUAGE_TAG} from '../lib/i18n';

const safeGetPublicHostInfo = async (userId: string) => {
  try {
    return await getAuthUserInfo(userId);
  } catch {
    return null;
  }
};

export const getPostsByExerciseAndSharingId = async (
  exerciseId: string,
  sharingId: string,
  limit: number,
) => {
  const posts = await postModel.getPostsByExerciseAndSharingId(
    exerciseId,
    sharingId,
    limit,
  );
  return Promise.all(
    posts.map(async post => ({
      ...post,
      userProfile: post.userId
        ? await safeGetPublicHostInfo(post.userId)
        : null,
    })),
  );
};

export const createPost = async (
  postParams: CreatePostType,
  userId: string,
) => {
  let classifications, translatedText;
  try {
    classifications = await classifyText(postParams.text);
  } catch (error) {
    console.error(error);
  }

  try {
    translatedText =
      postParams.language !== DEFAULT_LANGUAGE_TAG
        ? await translate(postParams.text, postParams.language)
        : undefined;
  } catch (error) {
    console.error(error);
  }

  const approved = !(classifications && classifications.length);

  const postData = {
    ...omit(['anonymous'], postParams),
    userId: postParams.anonymous === false ? userId : null,
    approved,
    classifications,
    translatedText,
  };

  const {id, exerciseId, sharingId, text, language} = await postModel.addPost(
    postData,
  );
  const exercise = getExerciseById(exerciseId, language);
  const sharingSlide = getSharingSlideById(exercise, sharingId);
  await sendPostMessage(
    id,
    approved,
    exercise?.card?.image?.source,
    exercise?.name,
    sharingSlide?.content?.heading,
    text,
    translatedText,
    classifications,
    language,
  );
};

export const deletePost = async (postId: string) => {
  const post = await postModel.getPostById(postId);

  if (!post) {
    throw new RequestError(PostError.notFound);
  }

  await postModel.deletePost(postId);
};
