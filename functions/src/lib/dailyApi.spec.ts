import fetchMock, {enableFetchMocks} from 'jest-fetch-mock';

enableFetchMocks();

import {createRoom, deleteRoom} from './dailyApi';

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

      const room = await createRoom();
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock).toHaveBeenCalledWith('https://api.daily.co/v1/rooms', {
        headers: {
          Authorization: 'Bearer some-api-endpoint',
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });
      expect(room).toEqual({id: 'some-id', name: 'some-name'});
    });

    it('throws when not ok', async () => {
      fetchMock.mockResponseOnce('some-body', {status: 500});

      await expect(createRoom()).rejects.toThrow(
        new Error('Failed creating room, some-body'),
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
});
