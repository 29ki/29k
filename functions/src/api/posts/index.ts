import * as yup from 'yup';
import validator from 'koa-yup-validator';

import {createApiRouter} from '../../lib/routers';
import {PostError} from '../../../../shared/src/errors/Post';
import {
  createPost,
  deletePost,
  getPostsByExerciseId,
} from '../../controllers/posts';
import {RequestError} from '../../controllers/errors/RequestError';

import {
  DEFAULT_LANGUAGE_TAG,
  LANGUAGE_TAG,
  LANGUAGE_TAGS,
} from '../../lib/i18n';

const postsRouter = createApiRouter();

const POSTS_LIMIT = 20;

postsRouter.get('/:exerciseId', async ctx => {
  const {response} = ctx;
  const {exerciseId} = ctx.params;

  const posts = await getPostsByExerciseId(exerciseId, POSTS_LIMIT);

  response.status = 200;
  ctx.body = posts;
});

const CreatePostSchema = yup.object().shape({
  exerciseId: yup.string().required(),
  sharingId: yup.string().required(),
  text: yup.string().required(),
  anonymous: yup.boolean().default(true),
  language: yup
    .mixed<LANGUAGE_TAG>()
    .oneOf(LANGUAGE_TAGS)
    .default(DEFAULT_LANGUAGE_TAG),
});

type CreatePostData = yup.InferType<typeof CreatePostSchema>;

postsRouter.post('/', validator({body: CreatePostSchema}), async ctx => {
  const {id} = ctx.user;
  const postData = ctx.request.body as CreatePostData;

  await createPost(postData, id);
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
