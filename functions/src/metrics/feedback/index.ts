import * as yup from 'yup';
import validator from 'koa-yup-validator';
import {createMetricsRouter} from '../../lib/routers';
import * as feedbackController from '../../controllers/feedback';

const router = createMetricsRouter();

const feedbackBodySchema = yup.object({
  exerciseId: yup.string().required(),
  sessionId: yup.string(),
  completed: yup.boolean().required(),
  host: yup.boolean(),

  question: yup.string().required(),
  answer: yup.boolean().required(),
  comment: yup.string(),
});

type Body = yup.InferType<typeof feedbackBodySchema>;

export const feedbackRouter = router.post(
  '/',
  validator({
    body: feedbackBodySchema,
  }),
  async ({request, response}) => {
    const feedback = request.body as Body;

    await feedbackController.addFeedback(feedback);

    response.status = 200;
    return;
  },
);
