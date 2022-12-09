import {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import useAppState from '../../appState/state/state';

const usePreferredLanguage = () => {
  const {i18n} = useTranslation();
  const preferredLanguage = useAppState(
    state => state.settings.preferredLanguage,
  );

  useEffect(() => {
    i18n.changeLanguage(preferredLanguage);
  }, [i18n, preferredLanguage]);
};

export default usePreferredLanguage;
