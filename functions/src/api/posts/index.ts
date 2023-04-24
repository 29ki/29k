import validator from 'koa-yup-validator';

import {createApiAuthRouter} from '../../lib/routers';
import {PostError} from '../../../../shared/src/errors/Post';
import {
  createPost,
  deletePost,
  getPostsByExerciseAndSharingId,
} from '../../controllers/posts';
import {RequestError} from '../../controllers/errors/RequestError';
import {responseFilter} from '../lib/response';
import {
  CreatePostData,
  CreatePostSchema,
  PostSchema,
} from '../../../../shared/src/types/Post';

const postsRouter = createApiAuthRouter();

const POSTS_LIMIT = 20;

postsRouter.get(
  '/:exerciseId/:sharingId',
  responseFilter(PostSchema),
  async ctx => {
    const {response} = ctx;
    const {exerciseId, sharingId} = ctx.params;

    const posts = await getPostsByExerciseAndSharingId(
      exerciseId,
      sharingId,
      POSTS_LIMIT,
    );

    response.status = 200;
    ctx.body = posts;
  },
);

postsRouter.post('/', validator({body: CreatePostSchema}), async ctx => {
  const {id} = ctx.user;
  const language = ctx.language;
  const postData = ctx.request.body as CreatePostData;

  await createPost({...postData, language}, id);
  ctx.response.status = 200;
});

postsRouter.delete('/:postId', async ctx => {
  const {postId} = ctx.params;

  try {
    await deletePost(postId);
    ctx.response.status = 200;
  } catch (error) {
    const requestError = error as RequestError;
    switch (requestError.code) {
      case PostError.notFound:
        ctx.status = 404;
        break;

      default:
        throw error;
    }
    ctx.message = requestError.code;
  }
});

export {postsRouter};
