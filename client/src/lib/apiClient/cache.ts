import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';

type CacheRecord<T> = {
  expiry: string;
  data: T;
};

const runtimeCacheRefs = new Map();

export const getItem = async <T>(endpoint: string): Promise<T | undefined> => {
  const runtimeRef = runtimeCacheRefs.get(endpoint);
  const storedCache =
    runtimeRef ?? (await AsyncStorage.getItem(`api-cache@${endpoint}`));

  if (storedCache) {
    const cacheRecord = (runtimeRef ??
      JSON.parse(storedCache)) as CacheRecord<T>;

    if (dayjs.utc(cacheRecord.expiry).isAfter(dayjs.utc())) {
      if (!runtimeRef) {
        runtimeCacheRefs.set(endpoint, cacheRecord);
      }

      return runtimeCacheRefs.get(endpoint).data;
    }
  }
};

export const setItem = async <T>(endpoint: string, data: T, age: number) => {
  const cacheRecord: CacheRecord<T> = {
    data,
    expiry: dayjs.utc().add(age, 'seconds').toString(),
  };
  runtimeCacheRefs.set(endpoint, cacheRecord);
  AsyncStorage.setItem(`api-cache@${endpoint}`, JSON.stringify(cacheRecord));
};
