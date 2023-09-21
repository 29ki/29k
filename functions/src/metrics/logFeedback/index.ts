import validator from 'koa-yup-validator';
import {createMetricsRouter} from '../../lib/routers';
import * as feedbackController from '../../controllers/feedback';
import {AddFeedbackBodySchema} from '../../../../shared/src/schemas/Feedback';
import {AddFeedbackBody} from '../../../../shared/src/types/Feedback';

const router = createMetricsRouter();

export const feedbackRouter = router.post(
  '/',
  validator({
    body: AddFeedbackBodySchema,
  }),
  async ({request, response}) => {
    const feedback = request.body as AddFeedbackBody;

    await feedbackController.addFeedback(feedback);

    response.status = 200;
    return;
  },
);
