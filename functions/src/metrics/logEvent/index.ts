import * as yup from 'yup';
import validator from 'koa-yup-validator';
import {createMetricsRouter} from '../../lib/routers';
import * as metricsModel from '../../models/metrics';
import {properties} from '../lib/validation';

const router = createMetricsRouter();

const logEventBodySchema = yup.object().shape({
  userId: yup.string().uuid().required(),
  timestamp: yup.date().required(),
  event: yup.string().required(),
  properties: properties(),
});

type MetricsEvent = yup.InferType<typeof logEventBodySchema>;

export const logEventRouter = router.post(
  '/',
  validator({body: logEventBodySchema}),
  async ({request, response}) => {
    const {userId, timestamp, event, properties} = request.body as MetricsEvent;

    await metricsModel.logEvent(userId, new Date(timestamp), event, properties);

    response.status = 200;
    return;
  },
);
