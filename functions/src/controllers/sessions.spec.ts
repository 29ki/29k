const mockDynamicLinks = {
  createSessionInviteLink: jest
    .fn()
    .mockResolvedValue('http://some.dynamic/link'),
};
const mockDailyApi = {
  createRoom: jest.fn(() => ({
    id: 'some-fake-daily-id',
    url: 'http://fake.daily/url',
    name: 'some-fake-daily-room-name',
  })),
  updateRoom: jest.fn(() => ({
    id: 'some-fake-daily-id',
    url: 'http://fake.daily/url',
    name: 'some-fake-daily-room-name',
  })),
  deleteRoom: jest.fn(),
};

const mockGenerateVerificationCode = jest.fn();

import * as sessionModel from '../models/session';
import {
  createSession,
  joinSession,
  removeSession,
  updateSessionState,
  updateSession,
  getSessionsByUserId,
  getUpcomingPublicSessions,
  getSessionToken,
  updateInterestedCount,
  getSession,
} from './sessions';
import {getAuthUserInfo} from '../models/auth';
import {SessionType} from '../../../shared/src/types/Session';
import dayjs from 'dayjs';
import {RequestError} from './errors/RequestError';
import {
  JoinSessionError,
  ValidateSessionError,
} from '../../../shared/src/errors/Session';
import {generateSessionToken} from '../lib/dailyUtils';

jest.mock('../lib/utils', () => ({
  ...jest.requireActual('../lib/utils'),
  generateVerificationCode: mockGenerateVerificationCode,
}));
jest.mock('../lib/dailyApi', () => mockDailyApi);
jest.mock('../models/dynamicLinks', () => mockDynamicLinks);
jest.mock('../models/session');
jest.mock('../models/user');
jest.mock('../lib/dailyUtils');

const mockGetSessionsByUserId = sessionModel.getSessionsByUserId as jest.Mock;
const mockGetUpcomingPublicSessions =
  sessionModel.getUpcomingPublicSessions as jest.Mock;
const mockAddSession = sessionModel.addSession as jest.Mock;
const mockGetSessionById = sessionModel.getSessionById as jest.Mock;
const mockGetSessionStateById = sessionModel.getSessionStateById as jest.Mock;
const mockDeleteSession = sessionModel.deleteSession as jest.Mock;
const mockUpdateSession = sessionModel.updateSession as jest.Mock;
const mockUpdateInterestedCount =
  sessionModel.updateInterestedCount as jest.Mock;
const mockUpdateSessionState = sessionModel.updateSessionState as jest.Mock;
const mockGetSessionByInviteCode =
  sessionModel.getSessionByInviteCode as jest.Mock;
const mockGetPublicUserInfo = getAuthUserInfo as jest.Mock;
const mockGenerateSessionToken = generateSessionToken as jest.Mock;

jest.useFakeTimers().setSystemTime(new Date('2022-10-10T09:00:00Z'));

mockGetPublicUserInfo.mockResolvedValue({
  displayName: 'some-name',
  photoURL: 'some-photo-url',
});
beforeEach(async () => {
  jest.clearAllMocks();
});

describe('sessions - controller', () => {
  describe('getSessionsByUserId', () => {
    it('should get sessions with host profile', async () => {
      mockGetSessionsByUserId.mockResolvedValueOnce([
        {
          closingTime: '2022-10-10T10:00:00.000Z',
          hostId: 'some-user-id',
          userIds: ['*'],
        },
      ]);

      const sessions = await getSessionsByUserId('all');

      expect(sessions).toHaveLength(1);
      expect(sessions[0].hostProfile?.displayName).toEqual('some-name');
      expect(sessions[0].hostProfile?.photoURL).toEqual('some-photo-url');
      expect(mockGetSessionsByUserId).toHaveBeenCalledTimes(1);
      expect(mockGetSessionsByUserId).toHaveBeenCalledWith('all', undefined);
      expect(mockGetPublicUserInfo).toHaveBeenCalledTimes(1);
      expect(mockGetPublicUserInfo).toHaveBeenCalledWith('some-user-id');
    });

    it('should get public sessions by exerciseId with host profile', async () => {
      mockGetSessionsByUserId.mockResolvedValueOnce([
        {
          closingTime: '2022-10-10T10:00:00.000Z',
          hostId: 'some-user-id',
          userIds: ['*'],
        },
      ]);

      const sessions = await getSessionsByUserId(
        'some-user-id',
        'some-exercise-id',
      );

      expect(sessions).toHaveLength(1);
      expect(sessions[0].hostProfile?.displayName).toEqual('some-name');
      expect(sessions[0].hostProfile?.photoURL).toEqual('some-photo-url');
      expect(mockGetSessionsByUserId).toHaveBeenCalledTimes(1);
      expect(mockGetSessionsByUserId).toHaveBeenCalledWith(
        'some-user-id',
        'some-exercise-id',
      );
      expect(mockGetPublicUserInfo).toHaveBeenCalledTimes(1);
      expect(mockGetPublicUserInfo).toHaveBeenCalledWith('some-user-id');
    });

    it('should filter out sessions that have been closed', async () => {
      mockGetSessionsByUserId.mockResolvedValueOnce([
        {
          closingTime: '2022-10-10T09:00:00.000Z',
          hostId: 'some-user-id',
          userIds: ['*'],
        },
      ]);

      const sessions = await getSessionsByUserId('all');

      expect(sessions).toHaveLength(0);
    });

    it('should include closed sessions containing userid (aka user has joined)', async () => {
      mockGetSessionsByUserId.mockResolvedValueOnce([
        {
          closingTime: '2022-10-10T09:00:00.000Z',
          hostId: 'other-user-id',
          userIds: ['*', 'some-user-id'],
        },
      ]);

      const sessions = await getSessionsByUserId('some-user-id');

      expect(sessions).toHaveLength(1);
      expect(sessions).toEqual([
        {
          closingTime: '2022-10-10T09:00:00.000Z',
          hostId: 'other-user-id',
          hostProfile: {displayName: 'some-name', photoURL: 'some-photo-url'},
          userIds: ['*', 'some-user-id'],
        },
      ]);
    });

    it('should include closed sessions which userid is the host', async () => {
      mockGetSessionsByUserId.mockResolvedValueOnce([
        {
          closingTime: '2022-10-10T09:00:00.000Z',
          hostId: 'host-user-id',
          userIds: ['*'],
        },
      ]);

      const sessions = await getSessionsByUserId('host-user-id');

      expect(sessions).toHaveLength(1);
      expect(sessions).toEqual([
        {
          closingTime: '2022-10-10T09:00:00.000Z',
          hostId: 'host-user-id',
          hostProfile: {displayName: 'some-name', photoURL: 'some-photo-url'},
          userIds: ['*'],
        },
      ]);
    });
  });

  describe('getUpcomingPublicSessions', () => {
    it('should get sessions with host profile', async () => {
      mockGetUpcomingPublicSessions.mockResolvedValueOnce([
        {
          closingTime: '2022-10-10T10:00:00.000Z',
          hostId: 'some-user-id',
          userIds: ['*'],
        },
      ]);

      const sessions = await getUpcomingPublicSessions();

      expect(sessions).toHaveLength(1);
      expect(sessions[0].hostProfile?.displayName).toEqual('some-name');
      expect(sessions[0].hostProfile?.photoURL).toEqual('some-photo-url');
      expect(mockGetUpcomingPublicSessions).toHaveBeenCalledTimes(1);
      expect(mockGetUpcomingPublicSessions).toHaveBeenCalledWith(undefined);
      expect(mockGetPublicUserInfo).toHaveBeenCalledTimes(1);
      expect(mockGetPublicUserInfo).toHaveBeenCalledWith('some-user-id');
    });

    it('supports limiting the query', async () => {
      mockGetUpcomingPublicSessions.mockResolvedValueOnce([]);

      await getUpcomingPublicSessions(4);

      expect(mockGetUpcomingPublicSessions).toHaveBeenCalledTimes(1);
      expect(mockGetUpcomingPublicSessions).toHaveBeenCalledWith(4);
    });
  });

  describe('getSession', () => {
    it('should return the private session', async () => {
      mockGetSessionById.mockResolvedValueOnce({
        dailyRoomName: 'some-room-name',
        hostId: 'some-host-id',
        userIds: ['some-user-id'],
        type: SessionType.private,
      });

      const result = await getSession('some-user-id', 'some-session-id');

      expect(result).toEqual({
        dailyRoomName: 'some-room-name',
        hostId: 'some-host-id',
        hostProfile: {displayName: 'some-name', photoURL: 'some-photo-url'},
        type: 'private',
        userIds: ['some-user-id'],
      });
    });

    it('should return existing public session', async () => {
      mockGetSessionById.mockResolvedValueOnce({
        dailyRoomName: 'some-room-name',
        hostId: 'some-host-id',
        userIds: ['some-other-user-id'],
        type: SessionType.public,
      });

      const result = await getSession('some-user-id', 'some-session-id');

      expect(result).toEqual({
        dailyRoomName: 'some-room-name',
        hostId: 'some-host-id',
        hostProfile: {displayName: 'some-name', photoURL: 'some-photo-url'},
        type: 'public',
        userIds: ['some-other-user-id'],
      });
    });

    it('should throw if session is not found', async () => {
      mockGetSessionById.mockResolvedValueOnce(undefined);

      await expect(
        getSessionToken('some-user-id', 'some-session-id'),
      ).rejects.toEqual(Error(ValidateSessionError.notFound));
    });

    it('should throw if user is not part of private session', async () => {
      mockGetSessionById.mockResolvedValueOnce({
        dailyRoomName: 'some-room-name',
        hostId: 'some-host-id',
        userIds: ['some-other-user-id'],
        type: SessionType.private,
      });

      await expect(
        getSession('some-user-id', 'some-session-id'),
      ).rejects.toEqual(Error(ValidateSessionError.userNotFound));
    });
  });

  describe('getSessionToken', () => {
    it('should return token for existing private session', async () => {
      mockGetSessionById.mockResolvedValueOnce({
        dailyRoomName: 'some-room-name',
        hostId: 'some-host-id',
        userIds: ['some-user-id'],
        type: SessionType.private,
      });
      mockGenerateSessionToken.mockReturnValueOnce('some-token');

      const result = await getSessionToken('some-user-id', 'some-session-id');

      expect(result).toEqual('some-token');
    });

    it('should return token for existing public session', async () => {
      mockGetSessionById.mockResolvedValueOnce({
        dailyRoomName: 'some-room-name',
        hostId: 'some-host-id',
        userIds: ['some-other-user-id'],
        type: SessionType.public,
      });
      mockGenerateSessionToken.mockReturnValueOnce('some-token');

      const result = await getSessionToken('some-user-id', 'some-session-id');

      expect(result).toEqual('some-token');
    });

    it('should throw if session is not found', async () => {
      mockGetSessionById.mockResolvedValueOnce(undefined);

      await expect(
        getSessionToken('some-user-id', 'some-session-id'),
      ).rejects.toEqual(Error(ValidateSessionError.notFound));
      expect(mockGenerateSessionToken).toHaveBeenCalledTimes(0);
    });

    it('should throw if user is not part of private session', async () => {
      mockGetSessionById.mockResolvedValueOnce({
        dailyRoomName: 'some-room-name',
        hostId: 'some-host-id',
        userIds: ['some-other-user-id'],
        type: SessionType.private,
      });

      await expect(
        getSessionToken('some-user-id', 'some-session-id'),
      ).rejects.toEqual(Error(ValidateSessionError.userNotFound));
      expect(mockGenerateSessionToken).toHaveBeenCalledTimes(0);
    });
  });

  describe('createSession', () => {
    it('should create a daily room that expires 2h after it starts', async () => {
      mockAddSession.mockResolvedValueOnce({
        hostId: 'some-user-id',
      });
      await createSession('some-user-id', {
        exerciseId: 'some-exercise-id',
        type: SessionType.public,
        startTime: new Date('2022-10-10T10:00:00Z').toISOString(),
        language: 'en',
      });

      const expireDate = dayjs('2022-10-10T12:00:00.000Z');
      expect(mockDailyApi.createRoom).toHaveBeenCalledWith(expireDate);
    });

    it('should create a dynamic link with correct path', async () => {
      mockAddSession.mockResolvedValueOnce({
        hostId: 'some-user-id',
      });
      mockGenerateVerificationCode.mockReturnValue(123456);
      await createSession('some-user-id', {
        exerciseId: 'some-exercise-id',
        type: SessionType.public,
        startTime: new Date('2022-10-10T10:00:00Z').toISOString(),
        language: 'en',
      });
      expect(mockDynamicLinks.createSessionInviteLink).toHaveBeenCalledWith(
        123456,
        'some-exercise-id',
        'some-name',
        'en',
      );
    });

    it('should create and return a session', async () => {
      mockGenerateVerificationCode.mockReturnValueOnce(123456);
      mockAddSession.mockResolvedValueOnce({
        hostId: 'some-user-id',
      });
      mockGetPublicUserInfo.mockResolvedValueOnce({
        displayName: 'some-name',
        photoURL: 'some-photo-url',
      });

      const session = await createSession('some-user-id', {
        exerciseId: 'some-exercise-id',
        type: SessionType.public,
        startTime: new Date('2022-10-10T10:00:00Z').toISOString(),
        language: 'en',
      });

      expect(mockAddSession).toHaveBeenCalledWith({
        exerciseId: 'some-exercise-id',
        language: 'en',
        dailyRoomName: 'some-fake-daily-room-name',
        hostId: 'some-user-id',
        id: 'some-fake-daily-id',
        link: 'http://some.dynamic/link',
        startTime: '2022-10-10T10:00:00.000Z',
        type: 'public',
        url: 'http://fake.daily/url',
        inviteCode: 123456,
        interestedCount: 0,
      });
      expect(session).toMatchObject({
        hostId: 'some-user-id',
        hostProfile: {
          displayName: 'some-name',
          photoURL: 'some-photo-url',
        },
      });
    });

    it('should create a invite code that is not in use', async () => {
      // first try generating a unique code finds it in use
      mockGenerateVerificationCode.mockReturnValueOnce(123456);
      mockGetSessionByInviteCode.mockResolvedValueOnce(
        'existing-session-using-the-same-invite-code',
      );

      // second try generating a unique code finds no session
      mockGenerateVerificationCode.mockReturnValueOnce(654321);
      mockGetSessionByInviteCode.mockResolvedValueOnce(undefined);
      mockAddSession.mockResolvedValueOnce({
        hostId: 'some-user-id',
      });
      mockGetPublicUserInfo.mockResolvedValueOnce({
        displayName: 'some-name',
        photoURL: 'some-photo-url',
      });

      const session = await createSession('some-user-id', {
        exerciseId: 'some-exercise-id',
        type: SessionType.public,
        startTime: new Date('2022-10-10T10:00:00Z').toISOString(),
        language: 'en',
      });

      expect(mockGenerateVerificationCode).toHaveBeenCalledTimes(2);
      expect(mockGetSessionByInviteCode).toHaveBeenCalledWith({
        inviteCode: 123456,
      });
      expect(mockGetSessionByInviteCode).toHaveBeenCalledWith({
        inviteCode: 654321,
      });

      expect(mockAddSession).toHaveBeenCalledWith({
        exerciseId: 'some-exercise-id',
        language: 'en',
        dailyRoomName: 'some-fake-daily-room-name',
        hostId: 'some-user-id',
        id: 'some-fake-daily-id',
        link: 'http://some.dynamic/link',
        startTime: '2022-10-10T10:00:00.000Z',
        type: 'public',
        url: 'http://fake.daily/url',
        inviteCode: 654321, // Code generated on the second try
        interestedCount: 0,
      });
      expect(session).toMatchObject({
        hostId: 'some-user-id',
        hostProfile: {
          displayName: 'some-name',
          photoURL: 'some-photo-url',
        },
      });
    });
  });

  describe('removeSession', () => {
    it('should throw if user is not the host', async () => {
      mockGetSessionById.mockResolvedValue({hostId: 'the-host-id'});
      await expect(
        removeSession('not-the-host-id', 'some-session-id'),
      ).rejects.toEqual(Error(ValidateSessionError.userNotAuthorized));
    });

    it('should delete session and daily room', async () => {
      mockGetSessionById.mockResolvedValue({
        id: 'some-session-id',
        dailyRoomName: 'some-daily-room-name',
        hostId: 'the-host-id',
      });

      await removeSession('the-host-id', 'some-session-id');

      expect(mockDailyApi.deleteRoom).toHaveBeenCalledWith(
        'some-daily-room-name',
      );
      expect(mockDeleteSession).toHaveBeenCalledWith('some-session-id');
    });

    it('should just resolve if session is not found', async () => {
      mockGetSessionById.mockResolvedValue(undefined);

      await expect(
        removeSession('the-host-id', 'some-session-id'),
      ).resolves.toBe(undefined);

      expect(mockDailyApi.deleteRoom).toHaveBeenCalledTimes(0);
      expect(mockDeleteSession).toHaveBeenCalledTimes(0);
    });
  });

  describe('joinSession', () => {
    it('should not call update if user is already included', async () => {
      mockGetSessionByInviteCode.mockResolvedValueOnce({
        id: 'some-session-id',
        userIds: ['some-other-user-id', 'some-user-id'],
      });
      const unmodifiedSession = await joinSession('some-user-id', 12345);
      expect(mockUpdateSession).toHaveBeenCalledTimes(0);
      expect(unmodifiedSession).toEqual({
        id: 'some-session-id',
        userIds: ['some-other-user-id', 'some-user-id'],
        hostProfile: {
          displayName: 'some-name',
          photoURL: 'some-photo-url',
        },
      });
    });

    it('should throw if session is not found', async () => {
      mockGetSessionByInviteCode.mockResolvedValueOnce(undefined);
      await expect(joinSession('some-user-id', 12345)).rejects.toEqual(
        new RequestError(JoinSessionError.notFound),
      );
    });

    it('should throw if session is unavailable', async () => {
      mockGetSessionByInviteCode.mockResolvedValueOnce(undefined);
      mockGetSessionByInviteCode.mockResolvedValueOnce(
        'some-unavailable-session',
      );
      await expect(joinSession('some-user-id', 12345)).rejects.toEqual(
        new RequestError(JoinSessionError.notAvailable),
      );
    });

    it('should update the session users and return it', async () => {
      mockGetSessionByInviteCode.mockResolvedValueOnce({
        id: 'some-session-id',
        userIds: ['some-other-user-id'],
      });
      mockGetSessionById.mockResolvedValueOnce({
        id: 'some-session-id',
      }); // second call (returned value)

      const joinedSession = await joinSession('some-user-id', 12345);
      expect(mockUpdateSession).toHaveBeenCalledWith('some-session-id', {
        userIds: ['some-other-user-id', 'some-user-id'],
      });
      expect(joinedSession).toEqual({
        id: 'some-session-id',
        hostProfile: {
          displayName: 'some-name',
          photoURL: 'some-photo-url',
        },
      });
    });
  });

  describe('updateSession', () => {
    it('should throw if user is not the host', async () => {
      mockGetSessionById.mockResolvedValue({hostId: 'the-host-id'});
      mockGetSessionStateById.mockResolvedValue({started: false});
      await expect(
        updateSessionState('not-the-host-id', 'some-session-id', {
          started: true,
        }),
      ).rejects.toEqual(Error(ValidateSessionError.userNotAuthorized));
    });

    it('should update the room expiry date to new startTime + 2h', async () => {
      mockGetSessionById.mockResolvedValueOnce({
        id: 'some-session-id',
        dailyRoomName: 'some-daily-room-name',
        hostId: 'the-host-id',
        startTime: new Date('2022-10-10T10:00:00Z').toISOString(),
      });
      mockGetSessionById.mockResolvedValueOnce({
        id: 'some-session-id',
      }); // second call (returned value)

      await updateSession('the-host-id', 'some-session-id', {
        startTime: new Date('2022-10-10T18:00:00Z').toISOString(),
      });

      expect(mockUpdateSession).toHaveBeenCalledWith('some-session-id', {
        startTime: new Date('2022-10-10T18:00:00Z').toISOString(),
      });
      expect(mockDailyApi.updateRoom).toHaveBeenCalledWith(
        'some-daily-room-name',
        // startTime + 2h
        dayjs('2022-10-10T20:00:00.000Z'),
      );
    });

    it('should not update room if startTime did not change', async () => {
      mockGetSessionById.mockResolvedValueOnce({
        id: 'some-session-id',
        dailyRoomName: 'some-daily-room-name',
        hostId: 'the-host-id',
        startTime: new Date('2022-10-10T10:00:00Z').toISOString(),
      });

      await updateSession('the-host-id', 'some-session-id', {
        startTime: new Date('2022-10-10T10:00:00Z').toISOString(),
      });

      expect(mockDailyApi.updateRoom).toHaveBeenCalledTimes(0);
    });

    it('should update the session and return it', async () => {
      mockGetSessionById.mockResolvedValueOnce({
        id: 'some-session-id',
        dailyRoomName: 'some-daily-room-name',
        hostId: 'the-host-id',
      });
      mockGetSessionById.mockResolvedValueOnce({
        id: 'some-session-id',
      }); // second call (returned value)

      const updatedSession = await updateSession(
        'the-host-id',
        'some-session-id',
        {type: SessionType.private},
      );
      expect(mockUpdateSession).toHaveBeenCalledWith('some-session-id', {
        type: 'private',
      });
      expect(updatedSession).toEqual({
        id: 'some-session-id',
        hostProfile: {
          displayName: 'some-name',
          photoURL: 'some-photo-url',
        },
      });
    });
  });

  describe('updateInterestedCount', () => {
    it('should update intersted count', async () => {
      await updateInterestedCount('some-session-id', true);

      expect(mockUpdateInterestedCount).toHaveBeenCalledWith(
        'some-session-id',
        true,
      );
    });
  });

  describe('updateSessionState', () => {
    it('should throw if user is not the host', async () => {
      mockGetSessionStateById.mockResolvedValueOnce({hostId: 'the-host-id'});
      await expect(
        updateSessionState('not-the-host-id', 'some-session-id', {
          index: 1,
        }),
      ).rejects.toEqual(Error(ValidateSessionError.userNotAuthorized));
    });

    it('should throw if session is not found', async () => {
      mockGetSessionStateById.mockResolvedValueOnce(undefined);
      await expect(
        updateSessionState('the-host-id', 'some-non-session-id', {
          index: 1,
        }),
      ).rejects.toEqual(Error(ValidateSessionError.notFound));
    });

    it('should update the session state and return it', async () => {
      mockGetSessionById.mockResolvedValueOnce({
        id: 'some-session-id',
        hostId: 'the-host-id',
      });
      mockGetSessionStateById.mockResolvedValueOnce({
        id: 'some-session-id',
        index: 1,
      }); // first return (to check if it exists)
      mockGetSessionStateById.mockResolvedValueOnce({
        id: 'some-session-id',
        index: 1,
      }); // returned value

      const updatedState = await updateSessionState(
        'the-host-id',
        'some-session-id',
        {index: 1},
      );
      expect(mockUpdateSessionState).toHaveBeenCalledWith('some-session-id', {
        index: 1,
      });
      expect(updatedState).toEqual({id: 'some-session-id', index: 1});
    });

    it('should update the session closingTime when started', async () => {
      mockGetSessionStateById.mockResolvedValueOnce({
        id: 'some-session-id',
        started: true,
      }); // first return (to check if it exists)
      mockGetSessionStateById.mockResolvedValueOnce({
        id: 'some-session-id',
        started: true,
      }); // returned value

      const updatedState = await updateSessionState(
        'the-host-id',
        'some-session-id',
        {started: true},
      );

      expect(mockUpdateSession).toHaveBeenCalledWith('some-session-id', {
        closingTime: '2022-10-10T09:05:00.000Z',
      });
      expect(updatedState).toEqual({id: 'some-session-id', started: true});
    });

    it('should also update the session when is ended', async () => {
      mockGetSessionById.mockResolvedValueOnce({
        id: 'some-session-id',
        hostId: 'the-host-id',
      });
      mockGetSessionStateById.mockResolvedValueOnce({
        id: 'some-session-id',
        ended: true,
      }); // first return (to check if it exists)
      mockGetSessionStateById.mockResolvedValueOnce({
        id: 'some-session-id',
        ended: true,
      }); // returned value

      const updatedState = await updateSessionState(
        'the-host-id',
        'some-session-id',
        {ended: true},
      );
      expect(mockUpdateSession).toHaveBeenCalledWith('some-session-id', {
        ended: true,
      });
      expect(mockUpdateSessionState).toHaveBeenCalledWith('some-session-id', {
        ended: true,
      });
      expect(updatedState).toEqual({id: 'some-session-id', ended: true});
    });
  });
});
