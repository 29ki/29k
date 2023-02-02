import * as userModel from '../models/user';
import {getProfile} from './user';

import {RequestError} from './errors/RequestError';
import {UserProfileError} from '../../../shared/src/errors/User';

jest.mock('../models/user');

beforeEach(async () => {
  jest.clearAllMocks();
});

describe('user - controller', () => {
  describe('getProfile', () => {
    it('should get user profile', async () => {
      const mockedGetPublicUserInfo = jest
        .mocked(userModel.getPublicUserInfo)
        .mockResolvedValueOnce({
          displayName: 'some-name',
          photoURL: 'some-photo-url',
        });

      const profile = await getProfile('user-id');

      expect(profile).toEqual({
        displayName: 'some-name',
        photoURL: 'some-photo-url',
      });

      expect(mockedGetPublicUserInfo).toHaveBeenCalledTimes(1);
      expect(mockedGetPublicUserInfo).toHaveBeenCalledWith('user-id');
    });

    it('should throw if user not found', async () => {
      jest.mocked(userModel.getPublicUserInfo).mockResolvedValueOnce({});

      await expect(getProfile('some-non-existing-user-id')).rejects.toEqual(
        new RequestError(UserProfileError.userNotFound),
      );
    });
  });
});
