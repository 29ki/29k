import * as authModel from '../models/auth';
import * as userModel from '../models/user';
import {getMe, getPublicHosts, getUser, updateUser} from './user';

import {RequestError} from './errors/RequestError';
import {UserError} from '../../../shared/src/errors/User';
import {ROLE} from '../../../shared/src/schemas/User';

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
          id: 'some-user-id',
          description: 'some description',
        });

      const data = await getMe('some-user-id');

      expect(mockedGetUser).toBeCalledTimes(1);
      expect(mockedGetUser).toHaveBeenCalledWith('some-user-id');
      expect(data).toEqual({
        description: 'some description',
        id: 'some-user-id',
      });
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

  describe('getPublicHosts', () => {
    it('should merge auth user info with user data', async () => {
      const mockedGetUsers = jest
        .mocked(userModel.getUsers)
        .mockResolvedValueOnce([
          {
            id: 'some-user-id',
            description: 'some description',
            role: ROLE.publicHost,
          },
          {
            id: 'some-other-user-id',
            description: 'some other description',
            role: ROLE.publicHost,
          },
        ]);
      const mockedGetPublicUserInfo = jest
        .mocked(authModel.getAuthUserInfo)
        .mockResolvedValueOnce({
          uid: 'some-user-id',
          displayName: 'Some Name',
          photoURL: 'http://pic.png',
        })
        .mockResolvedValueOnce({
          uid: 'some-other-user-id',
          displayName: 'Some Other Name',
          photoURL: 'http://pic2.png',
        });

      const hosts = await getPublicHosts();

      expect(hosts).toEqual([
        {
          description: 'some description',
          role: ROLE.publicHost,
          id: 'some-user-id',
          uid: 'some-user-id',
          displayName: 'Some Name',
          photoURL: 'http://pic.png',
        },
        {
          description: 'some other description',
          role: ROLE.publicHost,
          id: 'some-other-user-id',
          uid: 'some-other-user-id',
          displayName: 'Some Other Name',
          photoURL: 'http://pic2.png',
        },
      ]);

      expect(mockedGetUsers).toHaveBeenCalledTimes(1);
      expect(mockedGetUsers).toHaveBeenCalledWith({role: ROLE.publicHost});
      expect(mockedGetPublicUserInfo).toHaveBeenCalledTimes(2);
      expect(mockedGetPublicUserInfo).toHaveBeenCalledWith('some-user-id');
      expect(mockedGetPublicUserInfo).toHaveBeenCalledWith(
        'some-other-user-id',
      );
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
          id: 'some-user-id',
          description: 'some description',
        });

      const profile = await getUser('user-id');

      expect(profile).toEqual({
        id: 'some-user-id',
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
