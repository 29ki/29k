import * as yup from 'yup';
import validator from 'koa-yup-validator';

import {createApiRouter} from '../../lib/routers';
import {PostError} from '../../../../shared/src/errors/Post';
import {
  createPost,
  deletePost,
  getPostsByExerciseId,
  updatePost,
} from '../../controllers/posts';
import {RequestError} from '../../controllers/errors/RequestError';

import {
  DEFAULT_LANGUAGE_TAG,
  LANGUAGE_TAG,
  LANGUAGE_TAGS,
} from '../../lib/i18n';

const postsRouter = createApiRouter();

postsRouter.get('/:exerciseId', async ctx => {
  const {response} = ctx;
  const {exerciseId} = ctx.params;

  const posts = await getPostsByExerciseId(exerciseId, 10);

  response.status = 200;
  ctx.body = posts;
});

const CreatePostSchema = yup.object().shape({
  exerciseId: yup.string().required(),
  text: yup.string().required(),
  public: yup.boolean().default(false),
  language: yup
    .mixed<LANGUAGE_TAG>()
    .oneOf(LANGUAGE_TAGS)
    .default(DEFAULT_LANGUAGE_TAG),
});

type CreatePostData = yup.InferType<typeof CreatePostSchema>;

postsRouter.post('/', validator({body: CreatePostSchema}), async ctx => {
  const {id} = ctx.user;
  const postData = ctx.request.body as CreatePostData;

  await createPost(id, postData);
  ctx.response.status = 200;
});

const UpdatePostSchema = yup.object().shape({
  text: yup.string().default(undefined),
  public: yup.boolean().default(undefined),
});

type UpdatePostData = yup.InferType<typeof UpdatePostSchema>;

postsRouter.put('/:postId', validator({body: UpdatePostSchema}), async ctx => {
  const {id} = ctx.user;
  const {postId} = ctx.params;
  const postData = ctx.request.body as UpdatePostData;

  try {
    await updatePost(id, postId, postData);
    ctx.response.status = 200;
  } catch (error) {
    const requestError = error as RequestError;
    switch (requestError.code) {
      case PostError.notFound:
        ctx.status = 404;
        break;

      case PostError.userNotAuthorized:
        ctx.status = 401;
        break;

      default:
        throw error;
    }
    ctx.message = requestError.code;
  }
});

postsRouter.delete('/:postId', async ctx => {
  const {id} = ctx.user;
  const {postId} = ctx.params;

  try {
    await deletePost(id, postId);
    ctx.response.status = 200;
  } catch (error) {
    const requestError = error as RequestError;
    switch (requestError.code) {
      case PostError.notFound:
        ctx.status = 404;
        break;

      case PostError.userNotAuthorized:
        ctx.status = 401;
        break;

      default:
        throw error;
    }
    ctx.message = requestError.code;
  }
});

export {postsRouter};
