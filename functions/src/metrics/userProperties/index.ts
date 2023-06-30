import * as yup from 'yup';
import validator from 'koa-yup-validator';
import {createMetricsRouter} from '../../lib/routers';
import * as metricsModel from '../../models/metrics';
import {properties} from '../lib/validation';

const userPropertiesRouter = createMetricsRouter();

const userPropertiesParamsSchema = yup.object({
  userId: yup.string().uuid().required(),
});
const userPropertiesBodySchema = properties();

type Params = yup.InferType<typeof userPropertiesParamsSchema>;
type Body = yup.InferType<typeof userPropertiesBodySchema>;

userPropertiesRouter.post(
  '/:userId',
  validator({
    params: userPropertiesParamsSchema,
    body: userPropertiesBodySchema,
  }),
  async ({params, request, response}) => {
    const {userId} = params as Params;
    const properties = request.body as Body;

    await metricsModel.setUserProperties(userId, properties);

    response.status = 200;
    return;
  },
);

userPropertiesRouter.put(
  '/:userId',
  validator({
    params: userPropertiesParamsSchema,
    body: userPropertiesBodySchema,
  }),
  async ({params, request, response}) => {
    const {userId} = params as Params;
    const properties = request.body as Body;

    await metricsModel.setUserProperties(userId, properties, true);

    response.status = 200;
    return;
  },
);

export {userPropertiesRouter};
