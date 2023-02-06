import {PostError} from '../../../shared/src/errors/Post';
import {PostFields} from '../../../shared/src/types/Post';
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

export const createPost = async (
  userId: string,
  post: Omit<PostFields, 'id' | 'userId' | 'approved'>,
) => {
  const postData = {...post, userId, approved: true};
  await postModel.addPost(postData);
};

export const updatePost = async (
  userId: string,
  postId: string,
  post: Partial<Omit<PostFields, 'id'>>,
) => {
  const existingPost = await postModel.getPostById(postId);

  if (!existingPost) {
    throw new RequestError(PostError.notFound);
  }

  if (existingPost.userId !== userId) {
    throw new RequestError(PostError.userNotAuthorized);
  }

  await postModel.updatePost(postId, post);
};

export const deletePost = async (userId: string, postId: string) => {
  const post = await postModel.getPostById(postId);

  if (!post) {
    throw new RequestError(PostError.notFound);
  }

  if (post.userId !== userId) {
    throw new RequestError(PostError.userNotAuthorized);
  }

  await postModel.deletePost(postId);
};
