import yup from 'yup';

import {
  CreateFeedbackBodySchema,
  FeedbackParamsSchema,
  FeedbackInputSchema,
} from '../schemas/Feedback';

export type FeedbackParams = yup.InferType<typeof FeedbackParamsSchema>;
export type FeedbackInput = yup.InferType<typeof FeedbackInputSchema>;
export type CreateFeedbackBody = yup.InferType<typeof CreateFeedbackBodySchema>;

export type Feedback = FeedbackInput & {
  id: string;
  approved: boolean;
  createdAt: string;
};
