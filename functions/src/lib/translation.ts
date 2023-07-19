import {v2} from '@google-cloud/translate';
import {DEFAULT_LANGUAGE_TAG, LANGUAGE_TAG} from './i18n';

const translateClient = new v2.Translate();

export const translate = async (
  message: string,
  from: LANGUAGE_TAG,
  to: LANGUAGE_TAG = DEFAULT_LANGUAGE_TAG,
) => {
  const [translatedMessage] = await translateClient.translate(message, {
    from,
    to,
  });

  return translatedMessage;
};
