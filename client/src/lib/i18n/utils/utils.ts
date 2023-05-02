import {clone} from 'ramda';
import content from '../../../../../content/content.json';
import {LANGUAGE_TAGS} from '../../../../../shared/src/constants/i18n';
import useAppState from '../../appState/state/state';

export const omitExercisesAndCollections = (resources: typeof content.i18n) => {
  const allResources = clone(resources) as unknown as Record<
    string,
    Record<string, string>
  >; // Can't delete exercises in type content.i18n since it's not optional
  for (const ln of LANGUAGE_TAGS) {
    delete allResources[ln].exercises;
    delete allResources[ln].collections;
  }
  return allResources;
};

export const getShowHiddenContent = () =>
  useAppState.getState().settings.showHiddenContent;
