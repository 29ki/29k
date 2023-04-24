import {ReportParams} from '../../../shared/src/types/Report';
import {LANGUAGE_TAG} from '../lib/i18n';
import {sendReportEmail} from '../models/email';

type ReportData = {
  text: string;
  email?: string;
  language: LANGUAGE_TAG;
  params: ReportParams;
};

export const createReport = async (data: ReportData) => sendReportEmail(data);
