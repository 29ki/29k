import validator from 'koa-yup-validator';
import {createMetricsRouter} from '../../lib/routers';
import * as feedbackController from '../../controllers/feedback';
import {CreateFeedbackBodySchema} from '../../../../shared/src/schemas/Feedback';
import {CreateFeedbackBody} from '../../../../shared/src/types/Feedback';

const router = createMetricsRouter();

export const feedbackRouter = router.post(
  '/',
  validator({
    body: CreateFeedbackBodySchema,
  }),
  async ({request, response}) => {
    const feedback = request.body as CreateFeedbackBody;

    await feedbackController.addFeedback(feedback);

    response.status = 200;
    return;
  },
);
