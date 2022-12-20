import {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {Alert} from 'react-native';
import auth from '@react-native-firebase/auth';

import useAppState from '../../appState/state/state';
import useUserState from '../state/state';

const useDeleteUser = () => {
  const {t} = useTranslation('Component.DeleteData');
  const resetAppState = useAppState(state => state.reset);
  const resetUserState = useUserState(state => state.reset);

  const deleteData = useCallback(async () => {
    await auth().currentUser?.delete();
    resetAppState();
    resetUserState(true);
  }, [resetAppState, resetUserState]);

  return useCallback(
    () =>
      new Promise(resolve => {
        Alert.alert(t('header'), t('text'), [
          {
            text: t('buttons.cancel'),
            style: 'cancel',
            onPress: () => resolve(false),
          },
          {
            text: t('buttons.confirm'),
            style: 'destructive',
            onPress: async () => {
              await deleteData();
              resolve(true);
            },
          },
        ]);
      }),
    [t, deleteData],
  );
};

export default useDeleteUser;
