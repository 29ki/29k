import * as yup from 'yup';
import {DEFAULT_LANGUAGE_TAG} from '../constants/i18n';
import {transformTimestamp} from '../modelUtils/transform';
import {LanguageSchema} from './Language';
import {UserSchema} from './User';

export enum SessionMode {
  async = 'async',
  live = 'live',
}

export enum SessionType {
  private = 'private',
  public = 'public',
}

const SessionStateFieldsSchema = yup.object({
  index: yup.number().required(),
  playing: yup.boolean().required(),
  started: yup.boolean().required(),
  ended: yup.boolean().required(),
  id: yup.string().required(),
  completed: yup.boolean(),
});
export type SessionStateFields = yup.InferType<typeof SessionStateFieldsSchema>;

const SessionBaseFiledsSchema = yup.object({
  id: yup.string().required(),
  mode: yup.mixed<SessionMode>().oneOf(Object.values(SessionMode)).required(),
  type: yup.mixed<SessionType>().oneOf(Object.values(SessionType)).required(),
  exerciseId: yup.string().required(),
  language: LanguageSchema.required(),
});

const LiveSessionFieldsSchema = yup
  .object({
    dailyRoomName: yup.string().required(),
    url: yup.string().required(),
    link: yup.string(),
    inviteCode: yup.number().required(),
    interestedCount: yup.number().required(),
    hostId: yup.string().required(),
    userIds: yup.array().of(yup.string().required()).required(),
    ended: yup.boolean().required(),
  })
  .concat(SessionBaseFiledsSchema);
export type LiveSessionFields = yup.InferType<typeof LiveSessionFieldsSchema>;

// Applicaton schema
export const SessionStateSchema = yup
  .object({
    timestamp: transformTimestamp.required(),
  })
  .concat(SessionStateFieldsSchema);
export type SessionState = yup.InferType<typeof SessionStateSchema>;

export const LiveSessionSchema = yup
  .object({
    closingTime: transformTimestamp.required(),
    startTime: transformTimestamp.required(),
    createdAt: transformTimestamp.required(),
    updatedAt: transformTimestamp.required(),
    hostProfile: yup.object().concat(UserSchema).nullable(),
  })
  .concat(LiveSessionFieldsSchema);
export type LiveSession = yup.InferType<typeof LiveSessionSchema>;

export const AsyncSessionSchema = yup
  .object({
    startTime: yup.string().required(),
  })
  .concat(SessionBaseFiledsSchema);
export type AsyncSession = yup.InferType<typeof AsyncSessionSchema>;

export const CreateSessionSchema = LiveSessionSchema.pick([
  'exerciseId',
  'type',
]).concat(
  yup.object({
    startTime: yup.string().required(),
    language: LanguageSchema.default(DEFAULT_LANGUAGE_TAG),
  }),
);
export type CreateSession = yup.InferType<typeof CreateSessionSchema>;

export const UpdateSessionSchema = yup
  .object({
    startTime: yup.string(),
    type: yup.mixed<SessionType>().oneOf(Object.values(SessionType)),
  })
  .test(
    'nonEmptyObject',
    'object may not be empty',
    test => Object.keys(test).length > 0,
  );
export type UpdateSession = yup.InferType<typeof UpdateSessionSchema>;

export const InterestedCountSchema = yup.object({
  increment: yup.boolean().required(),
});
export type InterestedCountUpdate = yup.InferType<typeof InterestedCountSchema>;

export const SessionStateUpdateSchema = SessionStateSchema.partial().test(
  'nonEmptyObject',
  'object may not be empty',
  test => Object.keys(test).length > 0,
);
export type SessionStateUpdate = yup.InferType<typeof SessionStateUpdateSchema>;

export const JoinSessionSchema = LiveSessionSchema.pick(['inviteCode']);
export type JoinSession = yup.InferType<typeof JoinSessionSchema>;

export type DailyUserData = {
  inPortal: boolean;
  photoURL?: string;
};
