import sendgrid from '@sendgrid/mail';
import dayjs from 'dayjs';

import config from '../lib/config';
import {LANGUAGE_TAG} from '../lib/i18n';

const TO_HELP = {
  pt: ['help+fjn@29k.org', '29k@joseneves.org'],
  sv: 'help+sv@29k.org',
  en: 'help@29k.org',
  es: 'help@29k.org',
};

const createReportEmail = ({
  emailTo,
  emailFrom,
  message,
}: {
  emailTo: string | string[];
  emailFrom?: string;
  message: string;
}) => {
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
    html: `<strong>${message}</strong>`,
    categories: ['Report from user'],
  };
};

sendgrid.setApiKey(config.SENDGRID_API_KEY);

export const sendReportEmail = ({
  userEmail,
  text,
  language,
}: {
  userEmail?: string;
  text: string;
  language: LANGUAGE_TAG;
}) => {
  try {
    sendgrid.send(
      createReportEmail({
        emailTo: TO_HELP[language] || TO_HELP['en'],
        emailFrom: userEmail,
        message: text,
      }),
    );
  } catch (err) {
    console.log(err);
  }
};
