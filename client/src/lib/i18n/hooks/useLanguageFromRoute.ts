import {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {findBestAvailableLanguage} from 'react-native-localize';
import {LANGUAGE_TAG} from '../../../../../shared/src/constants/i18n';
import useAppState from '../../appState/state/state';

const useLanguageFromRoute = () => {
  const {i18n} = useTranslation();
  const navigation = useNavigation();
  const setSettings = useAppState(state => state.setSettings);

  useEffect(
    () =>
      navigation.addListener('state', () => {
        // NOTE: This method is not typed correctly but is available and takes care of parsing the router state correctly
        const route = (navigation as any).getCurrentRoute();
        if (route && route?.params?.language) {
          // Figure what language to use from the route params
          const languages = route.params.language.split(',');
          const languageTag = findBestAvailableLanguage(languages)
            ?.languageTag as LANGUAGE_TAG;

          if (languageTag) {
            // Set the route language as the preferred language
            setSettings({preferredLanguage: languageTag});
          }
        }
      }),
    [navigation, i18n, setSettings],
  );
};

export default useLanguageFromRoute;
