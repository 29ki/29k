import {parse as parseCacheControl} from 'cache-control-parser';
import {useCallback, useEffect, useMemo, useState} from 'react';

import apiClient from './apiClient';
import * as CacheControl from './cache';

const useGet = <T>(
  endpoint: string,
  options: {skip: boolean} = {skip: false},
) => {
  const [data, setData] = useState<T>();
  const [error, setError] = useState<Error>();
  // const [loading, setLoading] = useState<Boolean>(false);

  const doFetch = useCallback(async () => {
    try {
      // setLoading(true);
      const cachedResponse = await CacheControl.getItem<T>(endpoint);

      if (cachedResponse) {
        if (cachedResponse !== data) {
          setData(cachedResponse);
        }
        return;
      }

      const response = await apiClient(endpoint, {
        method: 'GET',
      });

      if (!response.ok) {
        setError(new Error(await response.text()));
      }

      const cacheControlStr = response.headers.get('cache-control');
      if (cacheControlStr) {
        const cacheControl = parseCacheControl(cacheControlStr);

        if (cacheControl['max-age']) {
          const responseData = await response.json();
          CacheControl.setItem<T>(
            endpoint,
            responseData,
            cacheControl['max-age'],
          );
        }
      }

      setData(await response.json());
      // setLoading(false);
    } catch (cause) {
      setError(new Error('Could get user profile', {cause}));
    }
  }, [data, endpoint]);

  useEffect(() => {
    if (!options.skip) {
      doFetch();
    }
  }, [doFetch, options.skip]);

  return useMemo(() => ({error, data}), [error, data]);
};

export default useGet;
