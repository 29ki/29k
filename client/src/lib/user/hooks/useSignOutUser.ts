import {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {Alert} from 'react-native';
import auth from '@react-native-firebase/auth';

const useSignOutUser = () => {
  const {t} = useTranslation('Component.SignOut');

  return useCallback(
    () =>
      new Promise((resolve, reject) => {
        Alert.alert(t('title'), t('message'), [
          {
            text: t('actions.cancel'),
            style: 'cancel',
            onPress: () => resolve(false),
          },
          {
            text: t('actions.confirm'),
            style: 'destructive',
            onPress: async () => {
              try {
                await auth().signOut();
                resolve(true);
              } catch (e: any) {
                reject(e);
              }
            },
          },
        ]);
      }),
    [t],
  );
};

export default useSignOutUser;
