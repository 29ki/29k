import * as yup from 'yup';
import validator from 'koa-yup-validator';

import {createApiAuthRouter} from '../../lib/routers';

import {createReport} from '../../controllers/report';

const reportRouter = createApiAuthRouter();

const ReportParamsSchema = yup.object().shape({
  screen: yup.string(),
  key: yup.string(),
  model: yup.string(),
  os: yup.string(),
  osVersion: yup.string(),
  nativeVersion: yup.string(),
  bundleVersion: yup.string(),
  gitCommit: yup.string(),
});

const CreateReportSchema = yup.object().shape({
  text: yup.string().required(),
  email: yup.string(),
  params: ReportParamsSchema,
});

type CreateReportData = yup.InferType<typeof CreateReportSchema>;
export type ReportParams = yup.InferType<typeof ReportParamsSchema>;

reportRouter.post('/', validator({body: CreateReportSchema}), async ctx => {
  const language = ctx.language;
  const data = ctx.request.body as CreateReportData;

  await createReport({...data, language});
  ctx.response.status = 200;
});

export {reportRouter};
