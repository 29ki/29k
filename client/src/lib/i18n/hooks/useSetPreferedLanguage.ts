import {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {Alert} from 'react-native';
import {
  CLIENT_LANGUAGE_TAGS,
  LANGUAGES,
  LANGUAGE_TAG,
} from '../../../../../shared/src/i18n/constants';
import useAppState from '../../appState/state/state';

const useSetPreferredLanguage = () => {
  const {t} = useTranslation('Modal.ChangeLanguage');
  const setSettings = useAppState(state => state.setSettings);

  return useCallback(
    (languageTag: LANGUAGE_TAG) => {
      if (CLIENT_LANGUAGE_TAGS.includes(languageTag)) {
        setSettings({preferredLanguage: languageTag});
      } else {
        const language = LANGUAGES[languageTag];
        Alert.alert(
          t('unsupportedLanguage.title', {lng: languageTag}),
          t('unsupportedLanguage.message', {language, lng: languageTag}),
          [
            {
              text: t('unsupportedLanguage.dismiss', {lng: languageTag}),
              onPress: () => {},
              style: 'cancel',
            },
            {
              text: t('unsupportedLanguage.confirm', {lng: languageTag}),
              onPress: () => setSettings({preferredLanguage: languageTag}),
            },
          ],
        );
      }
    },
    [setSettings, t],
  );
};

export default useSetPreferredLanguage;
