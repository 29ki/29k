import {clone, keys, pickBy} from 'ramda';
import {LANGUAGE_TAG} from '../constants/i18n';

export const removeHiddenExercises = <T>(exercises: T) =>
  pickBy<T, T>(e => !e.hidden, exercises);

export const removeHidden = <T>(
  resources: Record<LANGUAGE_TAG, Record<string, T>>,
) => {
  return keys(resources).reduce((res, ln: LANGUAGE_TAG) => {
    res[ln]['exercises'] = removeHiddenExercises(res[ln]['exercises']);
    return res;
  }, clone(resources));
};
