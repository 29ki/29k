import {getAuth} from 'firebase-admin/auth';
import {getAuthUserInfo} from './auth';

const mockGetUser = getAuth().getUser as jest.Mock;

describe('auth - model', () => {
  describe('getPublicUserInfo', () => {
    it('should return user profile info', async () => {
      mockGetUser.mockResolvedValueOnce({
        displayName: 'some-name',
        photoURL: 'some-photo-url',
      });

      const profile = await getAuthUserInfo('some-user-id');

      expect(profile.displayName).toEqual('some-name');
      expect(profile.photoURL).toEqual('some-photo-url');
      expect(mockGetUser).toHaveBeenCalledTimes(1);
      expect(mockGetUser).toHaveBeenCalledWith('some-user-id');
    });
  });
});
