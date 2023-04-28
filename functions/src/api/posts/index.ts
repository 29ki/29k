import * as yup from 'yup';
import {createApiAuthRouter} from '../../lib/routers';
import {PostError} from '../../../../shared/src/errors/Post';
import {
  createPost,
  deletePost,
  getPostsByExerciseAndSharingId,
} from '../../controllers/posts';
import {RequestError} from '../../controllers/errors/RequestError';
import validation from '../lib/validation';
import {
  CreatePostSchema,
  PostSchema,
} from '../../../../shared/src/schemas/Post';

const postsRouter = createApiAuthRouter();

const POSTS_LIMIT = 20;

const GetPostsParamsSchema = yup.object({
  exerciseId: yup.string().required(),
  sharingId: yup.string().required(),
});

postsRouter.get(
  '/:exerciseId/:sharingId',
  validation({
    params: GetPostsParamsSchema,
    response: yup.array().of(PostSchema),
  }),
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
