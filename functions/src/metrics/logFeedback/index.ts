import * as yup from 'yup';
import validator from 'koa-yup-validator';
import {createMetricsRouter} from '../../lib/routers';
import * as feedbackController from '../../controllers/feedback';
import {SessionMode, SessionType} from '../../../../shared/src/types/Session';

const router = createMetricsRouter();

const feedbackBodySchema = yup.object({
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
