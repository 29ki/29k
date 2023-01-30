import * as yup from 'yup';
import validator from 'koa-yup-validator';
import {createMetricsRouter} from '../../lib/routers';
import * as metricsModel from '../../models/metrics';
import {properties} from '../lib/validation';

const router = createMetricsRouter();

const logEventParamsSchema = yup.object({
  userId: yup.string().uuid().required(),
});
const logEventBodySchema = yup.object().shape({
  timestamp: yup.date().required(),
  event: yup.string().required(),
  properties: properties(),
});

type Params = yup.InferType<typeof logEventParamsSchema>;
type Body = yup.InferType<typeof logEventBodySchema>;

export const logEventRouter = router.post(
  '/:userId',
  validator({params: logEventParamsSchema, body: logEventBodySchema}),
  async ({params, request, response}) => {
    const {userId} = params as Params;
    const {timestamp, event, properties} = request.body as Body;

    await metricsModel.logEvent(userId, new Date(timestamp), event, properties);

    response.status = 200;
    return;
  },
);
