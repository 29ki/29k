import {v2} from '@google-cloud/translate';
import {LANGUAGE_TAG} from './i18n';

const translateClient = new v2.Translate();

export const translate = async (
  message: string,
  from: LANGUAGE_TAG,
  to: LANGUAGE_TAG,
) => {
  try {
    const [translatedMessage] = await translateClient.translate(message, {
      from,
      to,
    });

    return translatedMessage;
  } catch (error) {
    console.error(error);
    return message;
  }
};
