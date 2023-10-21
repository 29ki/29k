import * as yup from 'yup';
import {createApiAuthRouter} from '../../lib/routers';
import {PostError} from '../../../../shared/src/errors/Post';
import {createPost, deletePost, getPosts} from '../../controllers/posts';
import {RequestError} from '../../controllers/errors/RequestError';
import validation from '../lib/validation';
import {
  CreatePostSchema,
  PostSchema,
} from '../../../../shared/src/schemas/Post';

const postsRouter = createApiAuthRouter();

const POSTS_LIMIT = 20;

const GetPostsQuerySchema = yup.object({
  limit: yup.number().max(100).default(POSTS_LIMIT),
});

postsRouter.get(
  '/',
  validation({
    query: GetPostsQuerySchema,
    response: yup.array().of(PostSchema),
  }),
  async ctx => {
    const {response} = ctx;
    const {limit} = ctx.request.query;

    const posts = await getPosts(limit);

    response.status = 200;
    ctx.body = posts;
  },
);

const GetPostsByExerciseAndSharingParamsSchema = yup.object({
  exerciseId: yup.string().required(),
  sharingId: yup.string().required(),
});

postsRouter.get(
  '/:exerciseId/:sharingId',
  validation({
    query: GetPostsQuerySchema,
    params: GetPostsByExerciseAndSharingParamsSchema,
    response: yup.array().of(PostSchema),
  }),
  async ctx => {
    const {response} = ctx;
    const {exerciseId, sharingId} = ctx.params;
    const {limit} = ctx.request.query;

    const posts = await getPosts(limit, exerciseId, sharingId);

    response.status = 200;
    ctx.body = posts;
  },
);

postsRouter.post('/', validation({body: CreatePostSchema}), async ctx => {
  const {id} = ctx.user;
  const language = ctx.language;
  const postData = ctx.request.body;

  await createPost({...postData, language}, id);
  ctx.response.status = 200;
});

const DeletePostParamsSchema = yup.object({
  postId: yup.string().required(),
});

postsRouter.delete(
  '/:postId',
  validation({params: DeletePostParamsSchema}),
  async ctx => {
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
  },
);

export {postsRouter};
