import {clone, keys, pickBy} from 'ramda';
import {LANGUAGE_TAG} from '../constants/i18n';

export const filterPublishedContent = <T>(content: T) =>
  pickBy<T, T>(e => e.published, content);

export const filterHiddenContent = <T>(content: T) =>
  pickBy<T, T>(e => !e.hidden, content);

export const removeHiddenContent = <T>(
  resources: Record<LANGUAGE_TAG, Record<string, T>>,
) => {
  return keys(resources).reduce((res, ln: LANGUAGE_TAG) => {
    res[ln]['exercises'] = filterHiddenContent(res[ln]['exercises']);
    return res;
  }, clone(resources));
};

export const removeUnpublishedContent = <T>(
  resources: Record<LANGUAGE_TAG, Record<string, T>>,
) => {
  return keys(resources).reduce((res, ln: LANGUAGE_TAG) => {
    res[ln]['exercises'] = filterPublishedContent(res[ln]['exercises']);
    return res;
  }, clone(resources));
};
