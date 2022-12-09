import {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import useAppState from '../../appState/state/state';
import {LANGUAGE_TAGS} from '../../i18n';

const useToggleHiddenContent = () => {
  const {i18n} = useTranslation();
  const setShowHiddenContent = useAppState(state => state.setShowHiddenContent);

  const toggleHiddenContent = useCallback(
    (on: boolean) => {
      setShowHiddenContent(on);
      // Needs to be removed for all languages,
      // otherwise they are not reloaded when switching language
      LANGUAGE_TAGS.forEach(lng => i18n.removeResourceBundle(lng, 'exercises'));
      i18n.reloadResources(undefined, 'exercises');
    },
    [i18n, setShowHiddenContent],
  );

  return toggleHiddenContent;
};

export default useToggleHiddenContent;
