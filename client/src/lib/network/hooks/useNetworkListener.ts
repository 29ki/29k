import {useContext, useEffect, useMemo, useState} from 'react';
import NetInfo from '@react-native-community/netinfo';
import {useTranslation} from 'react-i18next';

import {ErrorBannerContext} from '../../contexts/ErrorBannerContext';

const useNetworkListener = () => {
  const {t} = useTranslation('Component.NetworkError');
  const errorBannerContext = useContext(ErrorBannerContext);
  const [isInternetReachable, setIsInternetReachable] = useState<
    boolean | null
  >(null);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsInternetReachable(state.isInternetReachable);
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Reports after a 5 second timeout if connection is not reestablished
  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined;
    if (isInternetReachable === false && isConnected === false) {
      timeout = setTimeout(() => {
        errorBannerContext?.showError(t('title'), t('message'), {
          disableAutoClose: true,
        });
      }, 5000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [isInternetReachable, isConnected, errorBannerContext, t]);

  return useMemo(
    () => Boolean(isInternetReachable && isConnected),
    [isInternetReachable, isConnected],
  );
};

export default useNetworkListener;
