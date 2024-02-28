import {useCallback} from 'react';
import useAppState from '../../appState/state/state';

const useToggleLockedContent = () => {
  const setSettings = useAppState(state => state.setSettings);

  const toggleLockedContent = useCallback(
    async (on: boolean) => {
      setSettings({showLockedContent: on});
    },
    [setSettings],
  );

  return toggleLockedContent;
};

export default useToggleLockedContent;
