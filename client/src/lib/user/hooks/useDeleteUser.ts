import {useCallback, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Alert} from 'react-native';
import auth from '@react-native-firebase/auth';

import useAppState from '../../appState/state/state';
import useUserState from '../state/state';

const useDeleteUser = () => {
  const {t} = useTranslation('Component.DeleteData');
  const resetAppState = useAppState(state => state.reset);
  const resetUserState = useUserState(state => state.reset);
  const [isDeletingUser, setIsDeletingUser] = useState(false);

  const deleteData = useCallback(async () => {
    try {
      setIsDeletingUser(true);
      await auth().currentUser?.delete();
      resetAppState();
      resetUserState(true);
      setIsDeletingUser(false);
    } catch (e: any) {
      setIsDeletingUser(false);
      throw e;
    }
  }, [resetAppState, resetUserState]);

  const deleteUser = useCallback(
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
                await deleteData();
                resolve(true);
              } catch (e: any) {
                reject(e);
              }
            },
          },
        ]);
      }),
    [t, deleteData],
  );

  return {deleteUser, isDeletingUser};
};

export default useDeleteUser;
