import * as yup from 'yup';

export enum ROLE {
  publicHost = 'publicHost',
}

const UserProfileSchema = yup.object({
  uid: yup.string().required(),
  displayName: yup.string(),
  photoURL: yup.string(),
});
export type UserProfile = yup.InferType<typeof UserProfileSchema>;

export const UserDataSchema = yup.object({
  description: yup.string(),
  role: yup.mixed<ROLE>().oneOf(Object.values(ROLE)),
  hostedPublicCount: yup.number(),
  hostedPrivateCount: yup.number(),
});
export type UserData = yup.InferType<typeof UserDataSchema>;

export const UserSchema = UserProfileSchema.concat(UserDataSchema);
export type User = yup.InferType<typeof UserSchema>;
