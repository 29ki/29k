import {clone, keys, pickBy} from 'ramda';
import {LANGUAGE_TAG} from '../constants/i18n';

export const filterPublishedContent = <T>(content: T) =>
  pickBy<T, T>(e => e.published, content);

export const filterHiddenContent = <T>(content: T) =>
  pickBy<T, T>(e => !e.hidden, content);

export const removeHiddenContent = (
  resources: Record<LANGUAGE_TAG, Record<string, any>>,
) => {
  return keys(resources).reduce((res, ln: LANGUAGE_TAG) => {
    res[ln]['exercises'] = filterHiddenContent(res[ln]['exercises']);
    res[ln]['collections'] = filterHiddenContent(res[ln]['collections']);
    return res;
  }, clone(resources));
};

export const removeUnpublishedContent = (
  resources: Record<LANGUAGE_TAG, Record<string, any>>,
) => {
  return keys(resources).reduce((res, ln: LANGUAGE_TAG) => {
    res[ln]['exercises'] = filterPublishedContent(res[ln]['exercises']);
    res[ln]['collections'] = filterPublishedContent(res[ln]['collections']);
    return res;
  }, clone(resources));
};
