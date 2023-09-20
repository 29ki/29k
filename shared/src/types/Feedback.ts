import yup from 'yup';

import {
  CreateFeedbackBodySchema,
  FeedbackParamsSchema,
  FeedbackInputSchema,
  FeedbackSchema,
} from '../schemas/Feedback';

export type FeedbackParams = yup.InferType<typeof FeedbackParamsSchema>;
export type FeedbackInput = yup.InferType<typeof FeedbackInputSchema>;
export type CreateFeedbackBody = yup.InferType<typeof CreateFeedbackBodySchema>;
export type Feedback = yup.InferType<typeof FeedbackSchema>;
