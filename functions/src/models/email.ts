import sendgrid from '@sendgrid/mail';
import dayjs from 'dayjs';
import {ReportParamsType} from '../../../shared/src/schemas/Report';

import config from '../lib/config';
import {
  renderUserReportHtml,
  renderUserReportText,
} from '../lib/emailTemplates/report';
import i18next, {LANGUAGE_TAG} from '../lib/i18n';

const TO_HELP = {
  pt: ['help+fjn@29k.org', '29k@joseneves.org'],
  sv: 'help+sv@29k.org',
  en: 'help@29k.org',
  es: 'help@29k.org',
};

const FROM_APP = {
  en: 'app@29k.org',
  sv: 'app@29k.org',
  pt: 'app@29k.org',
  es: 'app@29k-org',
};

const createReportEmail = (
  language: LANGUAGE_TAG,
  {
    emailTo,
    emailFrom,
    message,
    params,
  }: {
    emailTo: string | string[];
    emailFrom?: string;
    message: string;
    params: ReportParamsType;
  },
) => {
  const t = i18next.getFixedT(language, 'email');

  return {
    to: emailTo,
    from: FROM_APP[language] || FROM_APP['en'],
    ...(emailFrom
      ? {
          replyTo: {
            email: emailFrom,
          },
        }
      : {}),

    subject: `${t('userReport.subject')} - ${dayjs().format('DD/MM/YYYY')}`,
    text: renderUserReportText({
      body: t('userReport.body'),
      content: message,
      params,
    }),
    html: renderUserReportHtml({
      content: message,
      body: t('userReport.body'),
      params,
    }),
    categories: ['Report from user'],
  };
};

sendgrid.setApiKey(config.SENDGRID_API_KEY);

export const sendReportEmail = ({
  email,
  text,
  language,
  params,
}: {
  email?: string;
  text: string;
  language: LANGUAGE_TAG;
  params: ReportParamsType;
}) =>
  sendgrid.send(
    createReportEmail(language, {
      emailTo: TO_HELP[language] || TO_HELP['en'],
      emailFrom: email,
      message: text,
      params,
    }),
  );
