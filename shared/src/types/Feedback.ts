import yup from 'yup';

import {
  AddFeedbackBodySchema,
  FeedbackParamsSchema,
  FeedbackInputSchema,
  FeedbackSchema,
} from '../schemas/Feedback';

export type FeedbackParams = yup.InferType<typeof FeedbackParamsSchema>;
export type FeedbackInput = yup.InferType<typeof FeedbackInputSchema>;
export type AddFeedbackBody = yup.InferType<typeof AddFeedbackBodySchema>;
export type Feedback = yup.InferType<typeof FeedbackSchema>;
