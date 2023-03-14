import {LANGUAGE_TAG} from '../lib/i18n';
import {sendReportEmail} from '../models/email';
import {sendReportMessage} from '../models/slack';

type ReportData = {
  text: string;
  email?: string;
  language: LANGUAGE_TAG;
};

export const createReport = async ({text, email, language}: ReportData) => {
  await sendReportEmail({text, userEmail: email});
  await sendReportMessage('What would you like to report?', text, language);
};
