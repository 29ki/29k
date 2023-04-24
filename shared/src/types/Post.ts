import * as yup from 'yup';
import {
  DEFAULT_LANGUAGE_TAG,
  LANGUAGE_TAG,
  LANGUAGE_TAGS,
} from '../constants/i18n';
import {transformTimestamp} from '../modelUtils/transform';
import {UserSchema} from './User';

const PostFiledsSchema = yup.object({
  id: yup.string().required(),
  exerciseId: yup.string().required(),
  sharingId: yup.string().required(),
  userId: yup.string().nullable().default(null),
  language: yup.mixed<LANGUAGE_TAG>().oneOf(LANGUAGE_TAGS).required(),
  approved: yup.boolean().required(),
  text: yup.string().required(),
});
export type PostFields = yup.InferType<typeof PostFiledsSchema>;

export const PostSchema = yup
  .object({
    createdAt: transformTimestamp.required(),
    updatedAt: transformTimestamp.required(),
    userProfile: yup.object().concat(UserSchema).nullable(),
  })
  .concat(PostFiledsSchema);
export type Post = yup.InferType<typeof PostSchema>;

export const CreatePostSchema = PostSchema.pick([
  'exerciseId',
  'sharingId',
  'text',
]).concat(
  yup.object({
    anonymous: yup.boolean().default(true),
    language: yup
      .mixed<LANGUAGE_TAG>()
      .oneOf(LANGUAGE_TAGS)
      .default(DEFAULT_LANGUAGE_TAG),
  }),
);
export type CreatePostData = yup.InferType<typeof CreatePostSchema>;
