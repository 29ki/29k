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
  const [deletingUser, setDeletingUser] = useState(false);

  const deleteData = useCallback(async () => {
    setDeletingUser(true);
    await auth().currentUser?.delete();
    resetAppState();
    resetUserState(true);
    setDeletingUser(false);
  }, [resetAppState, resetUserState]);

  const deleteUser = useCallback(
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

  return {deleteUser, deletingUser};
};

export default useDeleteUser;
