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
      disableRetry?: boolean,
    ) =>
      new Promise(async (resolve, reject) => {
        const request = async () => {
          try {
            const response = await apiClient(input, init, authenticate);

            if (!response.ok) {
              throw new Error(await response.text());
            }

            resolve(response);
          } catch (error) {
            if (
              showErrorBanner ||
              (showErrorBanner === undefined &&
                ['POST', 'PUT', 'PATCH', 'DELETE'].includes(
                  init?.method?.toUpperCase() || '',
                ))
            ) {
              errorBannerContext?.showError(
                'Error',
                'Something went wrong',
                !disableRetry
                  ? {
                      disableAutoClose: true,
                      actionConfig: {
                        text: 'Retry',
                        action: request,
                      },
                      onClose: () => {
                        reject(error);
                      },
                    }
                  : undefined,
              );
            } else {
              reject(error);
              return;
            }

            if (disableRetry) {
              reject(error);
              return;
            }
          }
        };

        return await request();
      }),
    [errorBannerContext],
  );

  return client;
};

export default useApiClient;
