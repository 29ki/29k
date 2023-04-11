import * as authModel from '../models/auth';
import * as userModel from '../models/user';
import {getMe, getUser, updateUser} from './user';

import {RequestError} from './errors/RequestError';
import {UserError} from '../../../shared/src/errors/User';

jest.mock('../models/auth');
jest.mock('../models/user');

beforeEach(async () => {
  jest.clearAllMocks();
});

describe('user - controller', () => {
  describe('geMe', () => {
    it('should return current user data', async () => {
      const mockedGetUser = jest
        .mocked(userModel.getUser)
        .mockResolvedValueOnce({
          description: 'some description',
        });

      const data = await getMe('some-user-id');

      expect(mockedGetUser).toBeCalledTimes(1);
      expect(mockedGetUser).toHaveBeenCalledWith('some-user-id');
      expect(data).toEqual({description: 'some description'});
    });

    it('should return empty if no user data found', async () => {
      const mockedGetUser = jest
        .mocked(userModel.getUser)
        .mockResolvedValueOnce(null);

      const data = await getMe('some-user-id');

      expect(mockedGetUser).toBeCalledTimes(1);
      expect(mockedGetUser).toHaveBeenCalledWith('some-user-id');
      expect(data).toEqual({});
    });
  });

  describe('getUser', () => {
    it('should get user profile', async () => {
      const mockedGetPublicUserInfo = jest
        .mocked(authModel.getAuthUserInfo)
        .mockResolvedValueOnce({
          uid: 'some-user-id',
          displayName: 'some-name',
          photoURL: 'some-photo-url',
        });
      const mockedGetUser = jest
        .mocked(userModel.getUser)
        .mockResolvedValueOnce({
          description: 'some description',
        });

      const profile = await getUser('user-id');

      expect(profile).toEqual({
        uid: 'some-user-id',
        displayName: 'some-name',
        photoURL: 'some-photo-url',
        description: 'some description',
      });

      expect(mockedGetPublicUserInfo).toHaveBeenCalledTimes(1);
      expect(mockedGetPublicUserInfo).toHaveBeenCalledWith('user-id');
      expect(mockedGetUser).toHaveBeenCalledTimes(1);
      expect(mockedGetUser).toHaveBeenCalledWith('user-id');
    });

    it('should throw if user not found', async () => {
      jest
        .mocked(authModel.getAuthUserInfo)
        .mockResolvedValueOnce({uid: 'some-user-id'});

      await expect(getUser('some-non-existing-user-id')).rejects.toEqual(
        new RequestError(UserError.userNotFound),
      );
    });
  });

  describe('updateUser', () => {
    it('should call updateUser on user model', async () => {
      const mockedUpdateUser = jest
        .mocked(userModel.updateUser)
        .mockResolvedValueOnce();

      updateUser('some-user-id', {description: 'some description'});

      expect(mockedUpdateUser).toHaveBeenCalledTimes(1);
      expect(mockedUpdateUser).toHaveBeenCalledWith('some-user-id', {
        description: 'some description',
      });
    });
  });
});
