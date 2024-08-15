import {clone} from 'ramda';
import content from '../../../../../content/content.json';
import {LANGUAGE_TAGS} from '../../../../../shared/src/i18n/constants';
import useAppState from '../../appState/state/state';
import {PUBLISHABLE_NAMESPACES} from '../../../../../shared/src/content/constants';

export const omitPublishableContent = (resources: typeof content.i18n) => {
  const allResources = clone(resources) as unknown as Record<
    string,
    Record<string, string>
  >; // Can't delete exercises in type content.i18n since it's not optional
  LANGUAGE_TAGS.forEach(language => {
    PUBLISHABLE_NAMESPACES.forEach(namespace => {
      delete allResources[language][namespace];
    });
  });

  return allResources;
};

export const getShowHiddenContent = () =>
  useAppState.getState().settings.showHiddenContent;
