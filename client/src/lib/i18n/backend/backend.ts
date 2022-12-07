import {BackendModule, ReadCallback, ResourceKey} from 'i18next';
import {clone} from 'ramda';
import content from '../../../../../content/content.json';
import {
  LANGUAGE_TAG,
  DEFAULT_LANGUAGE_TAG,
} from '../../../../../shared/src/constants/i18n';
import {removeHiddenExercises} from '../../../../../shared/src/i18n/utils';
import useAppState from '../../appState/state/state';

type Namespace = keyof typeof content.i18n[typeof DEFAULT_LANGUAGE_TAG];

const Backend: BackendModule = {
  type: 'backend',
  init: function () {},
  read: function (
    language: LANGUAGE_TAG,
    namespace: Namespace,
    callback: ReadCallback,
  ) {
    const showNonPublishedContent = useAppState.getState().showHiddenContent;

    const resource = (
      content.i18n as unknown as Record<string, Record<string, string>>
    )[language][namespace] as ResourceKey;

    if (namespace === 'exercises') {
      if (showNonPublishedContent) {
        callback(null, resource);
      } else {
        // Default load only non hidden
        const exercises = clone(resource);
        const onlyNonHiddenExercises = removeHiddenExercises(exercises);

        callback(null, onlyNonHiddenExercises);
      }
    } else {
      callback(null, content.i18n[language][namespace]);
    }
  },
};

export default Backend;
