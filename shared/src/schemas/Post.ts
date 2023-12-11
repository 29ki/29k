import * as yup from 'yup';
import {DEFAULT_LANGUAGE_TAG} from '../i18n/constants';
import {transformTimestamp} from '../modelUtils/transform';
import {LanguageSchema} from './Language';
import {UserSchema} from './User';

const PostFieldsSchema = yup.object({
  id: yup.string().required(),
  exerciseId: yup.string().required(),
  sharingId: yup.string().required(),
  userId: yup.string().nullable().default(null),
  language: LanguageSchema.required(),
  approved: yup.boolean().required(),
  text: yup.string().required(),
});
export type PostFieldsType = yup.InferType<typeof PostFieldsSchema>;

export const PostSchema = yup
  .object({
    createdAt: transformTimestamp.required(),
    updatedAt: transformTimestamp.required(),
    userProfile: yup.object().concat(UserSchema).nullable(),
  })
  .concat(PostFieldsSchema);
export type PostType = yup.InferType<typeof PostSchema>;

export const CreatePostSchema = PostSchema.pick([
  'exerciseId',
  'sharingId',
  'text',
]).concat(
  yup.object({
    anonymous: yup.boolean().default(true),
    language: LanguageSchema.default(DEFAULT_LANGUAGE_TAG),
  }),
);
export type CreatePostType = yup.InferType<typeof CreatePostSchema>;
