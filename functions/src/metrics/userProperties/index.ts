import * as yup from 'yup';
import validator from 'koa-yup-validator';
import {createMetricsRouter} from '../../lib/routers';
import * as metricsModel from '../../models/metrics';
import {properties} from '../lib/validation';

const router = createMetricsRouter();

const userPropertiesParamsSchema = yup.object({
  id: yup.string().uuid().required(),
});
const userPropertiesBodySchema = properties();

type Params = yup.InferType<typeof userPropertiesParamsSchema>;
type Body = yup.InferType<typeof userPropertiesBodySchema>;

export const userPropertiesRouter = router.post(
  '/:id',
  validator({
    params: userPropertiesParamsSchema,
    body: userPropertiesBodySchema,
  }),
  async ({params, request, response}) => {
    const {id} = params as Params;
    const properties = request.body as Body;

    await metricsModel.setUserProperties(id, properties);

    response.status = 200;
    return;
  },
);
