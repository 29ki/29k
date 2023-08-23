import {useCallback, useContext} from 'react';
import firestore from '@react-native-firebase/firestore';
import {
  SessionStateType,
  LiveSessionType,
  SessionStateSchema,
} from '../../../../../shared/src/schemas/Session';
import {ErrorBannerContext} from '../../contexts/ErrorBannerContext';
import {useTranslation} from 'react-i18next';
import Sentry from '../../sentry';

const useSubscribeToSession = (sessionId: LiveSessionType['id']) => {
  const errorBannerContext = useContext(ErrorBannerContext);
  const {t} = useTranslation('Component.NetworkError');

  return useCallback(
    (onSnapshot: (sessionState: SessionStateType | undefined) => any) => {
      const stateDoc = firestore()
        .collection('sessions')
        .doc(sessionId)
        .collection('state')
        .doc(sessionId);

      const unsubscribe = stateDoc.onSnapshot(
        snapshot => {
          if (!snapshot.exists) {
            onSnapshot(undefined);
          }
          onSnapshot(SessionStateSchema.validateSync(snapshot.data()));
        },
        error => {
          errorBannerContext?.showError(
            t('subscriptionTitle'),
            t('subscriptionMessage'),
          );
          Sentry.captureException(error, {extra: {sessionId}});
        },
      );

      return unsubscribe;
    },
    [sessionId, t, errorBannerContext],
  );
};

export default useSubscribeToSession;
