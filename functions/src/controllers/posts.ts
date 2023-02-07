import {omit} from 'ramda';
import {PostError} from '../../../shared/src/errors/Post';
import {PostParams, PostUpdateParams} from '../../../shared/src/types/Post';
import * as postModel from '../models/post';
import {getPublicUserInfo} from '../models/user';
import {RequestError} from './errors/RequestError';

const safeGetPublicHostInfo = async (userId: string) => {
  try {
    return await getPublicUserInfo(userId);
  } catch {
    return undefined;
  }
};
export const getPostsByExerciseId = async (
  exerciseId: string,
  limit: number,
) => {
  const posts = await postModel.getPostsByExerciseId(exerciseId, limit);
  return Promise.all(
    posts.map(async post => ({
      ...post,
      userProfile: post.userId
        ? await safeGetPublicHostInfo(post.userId)
        : undefined,
    })),
  );
};

export const createPost = async (postParams: PostParams, userId: string) => {
  const postData = {
    ...omit(['public'], postParams),
    userId: postParams.public ? userId : null,
    approved: true,
  };
  await postModel.addPost(postData);
};

export const updatePost = async (
  postId: string,
  postParams: PostUpdateParams,
  userId: string,
) => {
  const existingPost = await postModel.getPostById(postId);

  if (!existingPost) {
    throw new RequestError(PostError.notFound);
  }

  const postUpdateData = {
    ...omit(['public'], postParams),
    userId: postParams.public ? userId : null,
  };

  await postModel.updatePost(postId, postUpdateData);
};

export const deletePost = async (postId: string) => {
  const post = await postModel.getPostById(postId);

  if (!post) {
    throw new RequestError(PostError.notFound);
  }

  await postModel.deletePost(postId);
};
