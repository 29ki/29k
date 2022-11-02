import {getAuth} from 'firebase-admin/auth';
import {getPublicUserInfo} from './user';

const mockGetUser = getAuth().getUser as jest.Mock;

describe('users - model', () => {
  describe('getPublicUserInfo', () => {
    it('should return user profile info', async () => {
      mockGetUser.mockResolvedValueOnce({
        displayName: 'some-name',
        photoURL: 'some-photo-url',
      });

      const profile = await getPublicUserInfo('some-user-id');

      expect(profile.displayName).toEqual('some-name');
      expect(profile.photoURL).toEqual('some-photo-url');
      expect(mockGetUser).toHaveBeenCalledTimes(1);
      expect(mockGetUser).toHaveBeenCalledWith('some-user-id');
    });
  });
});
