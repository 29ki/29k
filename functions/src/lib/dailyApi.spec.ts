import dayjs from 'dayjs';
import fetchMock, {enableFetchMocks} from 'jest-fetch-mock';

enableFetchMocks();

import {
  createRoom,
  DAILY_CONFIG_CACHE,
  deleteRoom,
  getDomainId,
  updateRoom,
} from './dailyApi';

afterEach(() => {
  fetchMock.resetMocks();
  jest.clearAllMocks();
});

describe('dailyApi', () => {
  describe('createRoom', () => {
    it('returns a new room from the Daily API', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({id: 'some-id', name: 'some-name'}),
      );

      const expireDate = dayjs('2020-01-01T01:01:01.000Z');

      const room = await createRoom(expireDate);
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock).toHaveBeenCalledWith('https://api.daily.co/v1/rooms', {
        headers: {
          Authorization: 'Bearer some-api-endpoint',
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          properties: {
            exp: 1577840461,
            start_audio_off: true,
            start_video_off: false,
          },
        }),
      });
      expect(room).toEqual({id: 'some-id', name: 'some-name'});
    });

    it('throws when not ok', async () => {
      fetchMock.mockResponseOnce('some-body', {status: 500});

      const expireDate = dayjs('2020-01-01T01:01:01.000Z');

      await expect(createRoom(expireDate)).rejects.toThrow(
        new Error('Failed creating room, some-body'),
      );
    });
  });

  describe('updateRoom', () => {
    it('returns an updated room from the Daily API', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({id: 'some-id', name: 'some-name'}),
      );

      const expireDate = dayjs('2020-01-01T01:01:01.000Z');

      const room = await updateRoom('some-name', expireDate);
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock).toHaveBeenCalledWith(
        'https://api.daily.co/v1/rooms/some-name',
        {
          headers: {
            Authorization: 'Bearer some-api-endpoint',
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({
            properties: {
              exp: 1577840461,
              start_audio_off: true,
              start_video_off: false,
            },
          }),
        },
      );
      expect(room).toEqual({id: 'some-id', name: 'some-name'});
    });

    it('throws when not ok', async () => {
      fetchMock.mockResponseOnce('some-body', {status: 500});

      const expireDate = dayjs('2020-01-01T01:01:01.000Z');

      await expect(updateRoom('some-name', expireDate)).rejects.toThrow(
        new Error('Failed updating room, some-body'),
      );
    });
  });

  describe('deleteRoom', () => {
    it('calls Daily API delete method', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({}));

      await deleteRoom('some-room-name');

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock).toHaveBeenCalledWith(
        'https://api.daily.co/v1/rooms/some-room-name',
        {
          headers: {
            Authorization: 'Bearer some-api-endpoint',
            'Content-Type': 'application/json',
          },
          method: 'DELETE',
        },
      );
    });

    it('throws when not ok', async () => {
      fetchMock.mockResponseOnce('some-body', {status: 500});

      await expect(deleteRoom('some-room-name')).rejects.toThrow(
        new Error('Failed deleting room, some-body'),
      );
    });
  });

  describe('getDomainId', () => {
    it('calls Daily API to get domain id', async () => {
      DAILY_CONFIG_CACHE.domainId = null;
      fetchMock.mockResponseOnce(JSON.stringify({domain_id: 'some-domain-id'}));

      const domainId = await getDomainId();

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock).toHaveBeenCalledWith('https://api.daily.co/v1', {
        headers: {
          Authorization: 'Bearer some-api-endpoint',
          'Content-Type': 'application/json',
        },
        method: 'GET',
      });
      expect(domainId).toEqual('some-domain-id');
    });

    it('should use cached value', async () => {
      DAILY_CONFIG_CACHE.domainId = 'some-domain-id';

      const domainId = await getDomainId();

      expect(fetchMock).toHaveBeenCalledTimes(0);
      expect(domainId).toEqual('some-domain-id');
    });

    it('throws when not ok', async () => {
      DAILY_CONFIG_CACHE.domainId = null;
      fetchMock.mockResponseOnce('some-body', {status: 500});

      await expect(getDomainId()).rejects.toThrow(
        new Error('Failed getting daily domain, some-body'),
      );
    });

    it('throws when failed to parse response', async () => {
      DAILY_CONFIG_CACHE.domainId = null;
      fetchMock.mockResponseOnce('');

      await expect(getDomainId()).rejects.toThrow(
        new Error('Failed reading daily config'),
      );
    });
  });
});
