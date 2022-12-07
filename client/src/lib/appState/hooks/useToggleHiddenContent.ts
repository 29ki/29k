import {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import useAppState from '../state/state';

const useToggleHiddenContent = () => {
  const {i18n} = useTranslation();
  const setShowHiddenContent = useAppState(state => state.setShowHiddenContent);

  const toggleHiddenContent = useCallback(
    (on: boolean) => {
      setShowHiddenContent(on);
      i18n.removeResourceBundle(i18n.language, 'exercises');
      i18n.reloadResources(undefined, 'exercises');
    },
    [i18n, setShowHiddenContent],
  );

  return toggleHiddenContent;
};

export default useToggleHiddenContent;
