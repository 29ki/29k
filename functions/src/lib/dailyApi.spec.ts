const fetchMock = jest.fn();
import {createRoom} from './dailyApi';

jest.mock('node-fetch', () => fetchMock);

describe('dailyApi', () => {
  describe('createRoom', () => {
    it('returns a new room from the Daily API', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({id: 'some-id', name: 'some-name'}),
      });

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
      fetchMock.mockResolvedValue({
        ok: false,
        body: 'some-body',
      });

      await expect(createRoom()).rejects.toThrow(
        new Error('Failed creating room, some-body'),
      );
    });
  });
});
