import {clone, keys, pickBy} from 'ramda';
import {LANGUAGE_TAG} from '../constants/i18n';

export const removeHiddenContent = <T>(content: T) =>
  pickBy<T, T>(e => !e.hidden, content);

export const removeHidden = <T>(
  resources: Record<LANGUAGE_TAG, Record<string, T>>,
) => {
  return keys(resources).reduce((res, ln: LANGUAGE_TAG) => {
    res[ln]['exercises'] = removeHiddenContent(res[ln]['exercises']);
    return res;
  }, clone(resources));
};
