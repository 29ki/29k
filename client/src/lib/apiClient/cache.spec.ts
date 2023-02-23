import * as CacheControl from './cache';
import AsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
import MockDate from 'mockdate';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

const mockNow = new Date('2022-12-10T10:00:00');
MockDate.set(mockNow); // Date.now()

jest.mock('@react-native-async-storage/async-storage');

describe('CacheControl', () => {
  describe('getItem', () => {
    it('should get item from async storage', async () => {
      const item = {name: 'some-name'};

      await CacheControl.setItem('/some-endpoint', {name: 'some-name'}, 3600);

      const cachedItem = await CacheControl.getItem('/some-endpoint');
      const cachedItem2 = await CacheControl.getItem('/some-endpoint');

      expect(AsyncStorage.getItem).toHaveBeenCalledWith(
        'api-cache@/some-endpoint',
      );
      expect(cachedItem).toEqual(item);
      expect(cachedItem2).toEqual(item);
    });
  });
  describe('setItem', () => {
    it('should save item on async storage', async () => {
      await CacheControl.setItem('/some-endpoint', {name: 'some-name'}, 3600);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'api-cache@/some-endpoint',
        JSON.stringify({
          data: {name: 'some-name'},
          expiry: '2022-12-10T10:00:00.000Z',
        }),
      );
    });
  });
});
