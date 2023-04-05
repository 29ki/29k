import {useCallback} from 'react';
import {Alert, Platform} from 'react-native';
import {useTranslation} from 'react-i18next';
import Rate from 'react-native-rate';
import {IOS_APPSTORE_ID, ANDROID_PACKAGE_NAME} from 'config';

import useAppState, {APP_RATING_REVISION} from '../../appState/state/state';
import {logEvent} from '../../metrics';

const RATING_OPTIONS = {
  AppleAppID: IOS_APPSTORE_ID,
  GooglePackageName: ANDROID_PACKAGE_NAME,
  preferInApp: true,
  openAppStoreIfInAppFails: true,
};

const STORE_TYPE = Platform.select({
  android: 'Google Play Store',
  ios: 'App Store',
});

const useRating = () => {
  const {t} = useTranslation('Component.Rating');
  const appRatedRevision = useAppState(
    state => state.settings.appRatedRevision,
  );
  const setSetting = useAppState(state => state.setSettings);

  const showAlert = useCallback(() => {
    Alert.alert(t('header'), t('text', {storeType: STORE_TYPE}), [
      {
        text: t('buttons.cancel'),
        style: 'cancel',
        onPress: () => {},
      },
      {
        text: t('buttons.confirm'),
        style: 'default',

        onPress: () => {
          Rate.rate(RATING_OPTIONS, (success: boolean) => {
            if (success) {
              logEvent('Rating Request Opened', undefined);
            }
          });
        },
      },
    ]);
  }, [t]);

  return useCallback(() => {
    // TODO remove android only when app is public on App Store
    if (Platform.OS === 'android') {
      if (!appRatedRevision || appRatedRevision < APP_RATING_REVISION) {
        showAlert();
        setSetting({appRatedRevision: APP_RATING_REVISION});
        return true;
      }
    }

    return false;
  }, [setSetting, appRatedRevision, showAlert]);
};

export default useRating;
