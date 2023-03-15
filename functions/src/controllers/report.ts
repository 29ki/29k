import {Params} from '../lib/emailTemplates/report';
import {LANGUAGE_TAG} from '../lib/i18n';
import {sendReportEmail} from '../models/email';

type ReportData = {
  text: string;
  email?: string;
  language: LANGUAGE_TAG;
  params: Params;
};

export const createReport = async (data: ReportData) => {
  await sendReportEmail(data);
};
