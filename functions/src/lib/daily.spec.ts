const fetchMock = jest.fn();

import {createRoom} from './daily';

jest.mock('node-fetch', () => fetchMock);

describe('lib/daily', () => {
  describe('createRoom', () => {
    it('returns a new room from the Daily API', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({id: 'some-id', name: 'some-name'}),
      });

      const room = await createRoom();
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
