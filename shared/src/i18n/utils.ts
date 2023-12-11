import {clone, keys, pickBy} from 'ramda';
import {LANGUAGE_TAG} from './constants';
import {
  HIDEABLE_NAMESPACES,
  PUBLISHABLE_NAMESPACES,
} from '../content/constants';

export const filterPublishedContent = <T>(content: T) =>
  pickBy<T, T>(e => e.published, content);

export const filterHiddenContent = <T>(content: T) =>
  pickBy<T, T>(e => !e.hidden, content);

export const removeHiddenContent = (
  resources: Record<LANGUAGE_TAG, Record<string, any>>,
) => {
  return keys(resources).reduce((res, language: LANGUAGE_TAG) => {
    HIDEABLE_NAMESPACES.forEach(namespace => {
      res[language][namespace] = filterHiddenContent(res[language][namespace]);
    });
    return res;
  }, clone(resources));
};

export const removeUnpublishedContent = (
  resources: Record<LANGUAGE_TAG, Record<string, any>>,
) => {
  return keys(resources).reduce((res, language: LANGUAGE_TAG) => {
    PUBLISHABLE_NAMESPACES.forEach(namespace => {
      res[language][namespace] = filterPublishedContent(
        res[language][namespace],
      );
    });
    return res;
  }, clone(resources));
};
