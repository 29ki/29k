import validator from 'koa-yup-validator';

import {
  CreateReportSchema,
  CreateReportData,
} from '../../../../shared/src/types/Report';
import {createApiAuthRouter} from '../../lib/routers';

import {createReport} from '../../controllers/report';

const reportRouter = createApiAuthRouter();

reportRouter.post(
  '/',
  validator({body: CreateReportSchema}, {body: {yup: {stripUnknown: true}}}),
  async ctx => {
    const language = ctx.language;
    const data = ctx.request.body as CreateReportData;

    await createReport({...data, language});
    ctx.response.status = 200;
  },
);

export {reportRouter};
