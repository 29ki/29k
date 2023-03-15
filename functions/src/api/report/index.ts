import * as yup from 'yup';
import validator from 'koa-yup-validator';

import {createApiRouter} from '../../lib/routers';

import {createReport} from '../../controllers/report';
import {Params} from '../../lib/emailTemplates/report';

const reportRouter = createApiRouter();

const CreateReportSchema = yup.object().shape({
  text: yup.string().required(),
  email: yup.string(),
  params: yup.object(),
});
type CreateReportData = yup.InferType<typeof CreateReportSchema>;

reportRouter.post('/', validator({body: CreateReportSchema}), async ctx => {
  const language = ctx.language;
  const data = ctx.request.body as CreateReportData;

  await createReport({...data, params: data.params as Params, language});
  ctx.response.status = 200;
});

export {reportRouter};
