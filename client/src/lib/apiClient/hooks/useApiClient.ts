import {useCallback, useContext} from 'react';
import apiClient from '../apiClient';
import {ErrorBannerContext} from '../../contexts/ErrorBannerContext';

const useApiClient = () => {
  const errorBannerContext = useContext(ErrorBannerContext);

  const client = useCallback(
    async (
      input: string,
      init?: RequestInit | undefined,
      authenticate?: boolean,
      showErrorBanner?: boolean,
    ) => {
      const request = () => apiClient(input, init, authenticate);
      try {
        return await request();
      } catch (error) {
        if (
          showErrorBanner ||
          (showErrorBanner === undefined &&
            ['POST', 'PUT', 'PATCH', 'DELETE'].includes(
              init?.method?.toUpperCase() || '',
            ))
        ) {
          errorBannerContext?.showError('Error', 'Something went wrong', {
            actionConfig: {text: 'Retry', action: request},
          });
        }
        throw error;
      }
    },
    [errorBannerContext],
  );

  return client;
};

export default useApiClient;
