import sendgrid from '@sendgrid/mail';
import dayjs from 'dayjs';

import config from '../lib/config';

const createReportEmail = ({
  emailTo,
  emailFrom,
  message,
}: {
  emailTo: string;
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
}: {
  userEmail?: string;
  text: string;
}) => {
  sendgrid.send(
    createReportEmail({
      emailTo: 'help@29k.org',
      emailFrom: userEmail,
      message: text,
    }),
  );
};
