import {ReportParamsType} from '../../../shared/src/schemas/Report';
import {LANGUAGE_TAG} from '../lib/i18n';
import {sendReportEmail} from '../models/email';

type ReportData = {
  text: string;
  email?: string;
  language: LANGUAGE_TAG;
  params: ReportParamsType;
};

export const createReport = async (data: ReportData) => sendReportEmail(data);
