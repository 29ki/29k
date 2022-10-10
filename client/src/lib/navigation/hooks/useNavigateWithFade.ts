import {useEffect} from 'react';
import {useRecoilState} from 'recoil';
import {navigationWithFadeAtom} from '../state/state';

const useNavigateWithFade = () => {
  const [navigatedWithFade, setNavigateWithFade] = useRecoilState(
    navigationWithFadeAtom,
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
