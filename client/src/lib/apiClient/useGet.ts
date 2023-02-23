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
      const cachedData = await CacheControl.getItem<T>(endpoint);

      if (cachedData) {
        setData(cachedData);
        // setLoading(false);
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

        setData(await CacheControl.getItem<T>(endpoint));
        // setLoading(false);
        return;
      }

      setData(await response.json());
      // setLoading(false);
    } catch (cause) {
      setError(new Error('Could not get user profile', {cause}));
    }
  }, [endpoint]);

  useEffect(() => {
    if (!options.skip) {
      doFetch();
    }
  }, [doFetch, options.skip]);

  return useMemo(() => ({error, data}), [error, data]);
};

export default useGet;
