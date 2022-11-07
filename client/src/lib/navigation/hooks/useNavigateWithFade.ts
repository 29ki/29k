import {useEffect} from 'react';
import useNavigationState from '../state/state';

const useNavigateWithFade = () => {
  const navigatedWithFade = useNavigationState(state => state.navigateWithFade);
  const setNavigateWithFade = useNavigationState(
    state => state.setNavigateWithFade,
  );

  useEffect(() => {
    setNavigateWithFade(true);
    return () => {
      setNavigateWithFade(false);
    };
  }, [setNavigateWithFade]);

  return navigatedWithFade;
};

export default useNavigateWithFade;
