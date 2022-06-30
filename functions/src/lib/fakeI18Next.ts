import {path} from 'ramda';
import {
  DEFAULT_LANGUAGE_TAG,
  LANGUAGE_TAGS,
} from '../../../shared/src/constants/i18n';

/*
  This utiliity can be used when i18Next initialisation is too slow. E.g. in Kill Switch
*/

const resolveLanguage = (lang: string) =>
  LANGUAGE_TAGS.includes(lang) ? lang : DEFAULT_LANGUAGE_TAG;

export const getFakeT = (
  lang: string,
  ns: string,
  keyPrefix: string | undefined,
  translations: object,
) => {
  const resolvedLng = resolveLanguage(lang);

  let keyPath = [resolvedLng, ns];

  if (keyPrefix) {
    keyPath = [...keyPath, ...keyPrefix.split('.')];
  }

  return (key: string) => path([...keyPath, ...key.split('.')], translations);
};
