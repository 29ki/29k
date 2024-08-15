import {useCallback} from 'react';
import useAppState from '../../appState/state/state';
import useReloadResourceBundles from './useReloadResourceBundles';

const useToggleHiddenContent = () => {
  const setSettings = useAppState(state => state.setSettings);
  const reloadResourceBundles = useReloadResourceBundles();

  const toggleHiddenContent = useCallback(
    async (on: boolean) => {
      setSettings({showHiddenContent: on});
      await reloadResourceBundles();
    },
    [setSettings, reloadResourceBundles],
  );

  return toggleHiddenContent;
};

export default useToggleHiddenContent;
