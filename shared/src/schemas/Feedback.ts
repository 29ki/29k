import * as yup from 'yup';
import {SessionMode, SessionType} from './Session';

export const FeedbackParamsSchema = yup.object().shape({
  screen: yup.string(),
  key: yup.string(),
  model: yup.string(),
  os: yup.string(),
  osVersion: yup.string(),
  nativeVersion: yup.string(),
  bundleVersion: yup.string(),
  gitCommit: yup.string(),
});

export const FeedbackInputSchema = yup.object({
  exerciseId: yup.string().required(),
  completed: yup.boolean().required(),
  sessionId: yup.string().required(),
  host: yup.boolean(),

  question: yup.string().required(),
  answer: yup.boolean().required(),
  comment: yup.string(),

  sessionType: yup
    .mixed<SessionType>()
    .oneOf(Object.values(SessionType))
    .required(),
  sessionMode: yup
    .mixed<SessionMode>()
    .oneOf(Object.values(SessionMode))
    .required(),
});

export const CreateFeedbackBodySchema = FeedbackInputSchema.concat(
  yup.object().shape({params: FeedbackParamsSchema}),
);
