import sendgrid from '@sendgrid/mail';
import dayjs from 'dayjs';

import config from '../lib/config';
import {Params, renderUserReportHtml} from '../lib/emailTemplates/report';
import i18next, {LANGUAGE_TAG} from '../lib/i18n';

const TO_HELP = {
  pt: ['help+fjn@29k.org', '29k@joseneves.org'],
  sv: 'help+sv@29k.org',
  en: 'help@29k.org',
  es: 'help@29k.org',
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
    params: Params;
  },
) => {
  const t = i18next.getFixedT(language, 'email.userReport');

  return {
    to: emailTo,
    from: 'app@29k.org',
    ...(emailFrom
      ? {
          replyTo: {
            email: emailFrom,
          },
        }
      : {}),

    subject: `Your report to 29k sessions - ${dayjs().format('DD/MM/YYYY')}`,
    text: message,
    html: renderUserReportHtml({
      content: message,
      body: t('body__markdown'),
      params,
    }),
    categories: ['Report from user'],
  };
};

sendgrid.setApiKey(config.SENDGRID_API_KEY);

export const sendReportEmail = ({
  userEmail,
  text,
  language,
  params,
}: {
  userEmail?: string;
  text: string;
  language: LANGUAGE_TAG;
  params: Params;
}) =>
  sendgrid.send(
    createReportEmail(language, {
      emailTo: TO_HELP[language] || TO_HELP['en'],
      emailFrom: userEmail,
      message: text,
      params,
    }),
  );
