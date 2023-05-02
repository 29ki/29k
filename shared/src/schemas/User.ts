import * as yup from 'yup';

export enum ROLE {
  publicHost = 'publicHost',
}

const UserProfileSchema = yup.object({
  uid: yup.string().required(),
  displayName: yup.string(),
  photoURL: yup.string(),
});
export type UserProfileType = yup.InferType<typeof UserProfileSchema>;

export const UserDataSchema = yup.object({
  description: yup.string(),
  role: yup.mixed<ROLE>().oneOf(Object.values(ROLE)),
  hostedPublicCount: yup.number(),
  hostedPrivateCount: yup.number(),
});
export type UserDataType = yup.InferType<typeof UserDataSchema>;

export const UserSchema = UserProfileSchema.concat(UserDataSchema);
export type UserType = yup.InferType<typeof UserSchema>;
