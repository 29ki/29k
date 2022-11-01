import {getAuth} from 'firebase-admin/auth';
import {getUserProfile} from './users';

const mockGetUser = getAuth().getUser as jest.Mock;

describe('users - controller', () => {
  describe('getUserProfile', () => {
    it('should return user profile info', async () => {
      mockGetUser.mockResolvedValueOnce({
        displayName: 'some-name',
        photoURL: 'some-photo-url',
      });

      const profile = await getUserProfile('some-user-id');

      expect(profile.displayName).toEqual('some-name');
      expect(profile.photoURL).toEqual('some-photo-url');
      expect(mockGetUser).toHaveBeenCalledTimes(1);
      expect(mockGetUser).toHaveBeenCalledWith('some-user-id');
    });
  });
});
