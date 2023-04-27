import {PostType, PostData} from '../schemas/Post';

export const getPost = (post: PostData): PostType => {
  return {
    ...post,
    createdAt: post.createdAt.toDate().toISOString(),
    updatedAt: post.updatedAt.toDate().toISOString(),
  };
};
