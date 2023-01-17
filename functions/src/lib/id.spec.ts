import {createRctUserId} from './id';

describe('id', () => {
  describe('createRctUserId', () => {
    it('should create deterministic hash of room id and user id', () => {
      expect(createRctUserId('some-room-name', 'some-user-id')).toEqual(
        'RpNuv3RsXRBfeQzpMZhrbE',
      );
    });
  });
});
