import {uniq} from 'ramda';
import * as yup from 'yup';
import {createApiAuthRouter} from '../../lib/routers';
import {
  createPost,
  getPosts,
  decreasePostRelates,
  increasePostRelates,
} from '../../controllers/posts';
import validation from '../lib/validation';
import {
  CreatePostSchema,
  PostSchema,
} from '../../../../shared/src/schemas/Post';
import {DEFAULT_LANGUAGE_TAG} from '../../lib/i18n';
import {LanguageSchema} from '../../../../shared/src/schemas/Language';

const postsRouter = createApiAuthRouter();

const POSTS_LIMIT = 50;

const GetPostsQuerySchema = yup.object({
  language: LanguageSchema.default(DEFAULT_LANGUAGE_TAG),
  limit: yup.number().max(100).default(POSTS_LIMIT),
});

postsRouter.get(
  '/',
  validation({
    query: GetPostsQuerySchema,
    response: yup.array().of(PostSchema),
  }),
  async ctx => {
    const {response, language} = ctx;
    const {limit} = ctx.request.query;
    const languages = uniq([language, DEFAULT_LANGUAGE_TAG]);

    const posts = await getPosts(limit, languages);

    response.status = 200;
    ctx.set('Cache-Control', 'max-age=300');
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
    const {limit, language} = ctx.request.query;

    const languages = uniq([language, DEFAULT_LANGUAGE_TAG]);
    const posts = await getPosts(limit, languages, exerciseId, sharingId);
    response.status = 200;
    ctx.body = posts;
  },
);

postsRouter.post('/', validation({body: CreatePostSchema}), async ctx => {
  const {id} = ctx.user;
  const postData = ctx.request.body;

  await createPost(postData, id);
  ctx.response.status = 200;
});

const PostRelateParamsSchema = yup.object({
  postId: yup.string().required(),
});

postsRouter.post(
  '/:postId/relate',
  validation({
    params: PostRelateParamsSchema,
  }),
  async ctx => {
    const {postId} = ctx.params;

    await increasePostRelates(postId);

    ctx.response.status = 200;
  },
);

postsRouter.delete(
  '/:postId/relate',
  validation({
    params: PostRelateParamsSchema,
  }),
  async ctx => {
    const {postId} = ctx.params;

    await decreasePostRelates(postId);

    ctx.response.status = 200;
  },
);

export {postsRouter};
