import {createMetricsRouter} from '../../lib/routers';

const router = createMetricsRouter();

export const logEventRouter = router.post('/', ({response}) => {
  response.status = 200;
  response.body = 'hej';
  return;
});
