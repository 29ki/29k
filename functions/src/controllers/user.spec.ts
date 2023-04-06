import * as userModel from '../models/auth';
import {getUser} from './user';

import {RequestError} from './errors/RequestError';
import {UserError} from '../../../shared/src/errors/User';

jest.mock('../models/user');

beforeEach(async () => {
  jest.clearAllMocks();
});

describe('user - controller', () => {
  describe('getProfile', () => {
    it('should get user profile', async () => {
      const mockedGetPublicUserInfo = jest
        .mocked(userModel.getAuthUserInfo)
        .mockResolvedValueOnce({
          uid: 'some-user-id',
          displayName: 'some-name',
          photoURL: 'some-photo-url',
        });

      const profile = await getUser('user-id');

      expect(profile).toEqual({
        uid: 'some-user-id',
        displayName: 'some-name',
        photoURL: 'some-photo-url',
      });

      expect(mockedGetPublicUserInfo).toHaveBeenCalledTimes(1);
      expect(mockedGetPublicUserInfo).toHaveBeenCalledWith('user-id');
    });

    it('should throw if user not found', async () => {
      jest
        .mocked(userModel.getAuthUserInfo)
        .mockResolvedValueOnce({uid: 'some-user-id'});

      await expect(getUser('some-non-existing-user-id')).rejects.toEqual(
        new RequestError(UserError.userNotFound),
      );
    });
  });
});
