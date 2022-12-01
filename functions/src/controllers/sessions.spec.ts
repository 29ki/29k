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
  deleteRoom: jest.fn(),
};

const mockGenerateVerificationCode = jest.fn();

import * as sessionModel from '../models/session';
import {
  createSession,
  joinSession,
  removeSession,
  updateExerciseState,
  updateSession,
  getSessions,
} from './sessions';
import {getPublicUserInfo} from '../models/user';
import {SessionType} from '../../../shared/src/types/Session';
import dayjs from 'dayjs';
import {RequestError} from './errors/RequestError';
import {JoinSessionError} from '../../../shared/src/errors/Session';

jest.mock('../lib/utils', () => ({
  ...jest.requireActual('../lib/utils'),
  generateVerificationCode: mockGenerateVerificationCode,
}));
jest.mock('../lib/dailyApi', () => mockDailyApi);
jest.mock('../models/dynamicLinks', () => mockDynamicLinks);
jest.mock('../models/session');
jest.mock('../models/user');

const mockGetSessions = sessionModel.getSessions as jest.Mock;
const mockAddSession = sessionModel.addSession as jest.Mock;
const mockGetSessionById = sessionModel.getSessionById as jest.Mock;
const mockDeleteSession = sessionModel.deleteSession as jest.Mock;
const mockUpdateSession = sessionModel.updateSession as jest.Mock;
const mockUpdateExerciseState = sessionModel.updateExerciseState as jest.Mock;
const mockGetSessionByInviteCode =
  sessionModel.getSessionByInviteCode as jest.Mock;
const mockGetPublicUserInfo = getPublicUserInfo as jest.Mock;

jest.useFakeTimers().setSystemTime(new Date('2022-10-10T09:00:00Z'));

mockGetPublicUserInfo.mockResolvedValue({
  displayName: 'some-name',
  photoURL: 'some-photo-url',
});
beforeEach(async () => {
  jest.clearAllMocks();
});

describe('sessions - controller', () => {
  describe('getSessions', () => {
    it('should get sessions with host profile', async () => {
      mockGetSessions.mockResolvedValueOnce([
        {
          hostId: 'some-user-id',
        },
      ]);

      const sessions = await getSessions('all');

      expect(sessions[0].hostProfile?.displayName).toEqual('some-name');
      expect(sessions[0].hostProfile?.photoURL).toEqual('some-photo-url');
      expect(mockGetSessions).toHaveBeenCalledTimes(1);
      expect(mockGetSessions).toHaveBeenCalledWith('all');
      expect(mockGetPublicUserInfo).toHaveBeenCalledTimes(1);
      expect(mockGetPublicUserInfo).toHaveBeenCalledWith('some-user-id');
    });
  });

  describe('createSession', () => {
    it('should create a daily room that expires 2h after it starts', async () => {
      mockAddSession.mockResolvedValueOnce({
        hostId: 'some-user-id',
      });
      await createSession('some-user-id', {
        contentId: 'some-content-id',
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
        contentId: 'some-content-id',
        type: SessionType.public,
        startTime: new Date('2022-10-10T10:00:00Z').toISOString(),
        language: 'en',
      });
      expect(mockDynamicLinks.createSessionInviteLink).toHaveBeenCalledWith(
        123456,
        'some-content-id',
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
        contentId: 'some-content-id',
        type: SessionType.public,
        startTime: new Date('2022-10-10T10:00:00Z').toISOString(),
        language: 'en',
      });

      expect(mockAddSession).toHaveBeenCalledWith({
        contentId: 'some-content-id',
        language: 'en',
        dailyRoomName: 'some-fake-daily-room-name',
        hostId: 'some-user-id',
        id: 'some-fake-daily-id',
        link: 'http://some.dynamic/link',
        startTime: '2022-10-10T10:00:00.000Z',
        type: 'public',
        url: 'http://fake.daily/url',
        inviteCode: 123456,
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
        contentId: 'some-content-id',
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
        contentId: 'some-content-id',
        language: 'en',
        dailyRoomName: 'some-fake-daily-room-name',
        hostId: 'some-user-id',
        id: 'some-fake-daily-id',
        link: 'http://some.dynamic/link',
        startTime: '2022-10-10T10:00:00.000Z',
        type: 'public',
        url: 'http://fake.daily/url',
        inviteCode: 654321, // Code generated on the second try
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
      ).rejects.toEqual(Error('user-unauthorized'));
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
      await expect(
        updateSession('not-the-host-id', 'some-session-id', {started: true}),
      ).rejects.toEqual(Error('user-unauthorized'));
    });

    it('should update the session and return it', async () => {
      mockGetSessionById.mockResolvedValueOnce({
        id: 'some-session-id',
        dailyRoomName: 'some-daily-room-name',
        hostId: 'the-host-id',
      });
      mockGetSessionById.mockResolvedValueOnce({
        id: 'some-session-id',
        started: true,
      }); // second call (returned value)

      const updatedSession = await updateSession(
        'the-host-id',
        'some-session-id',
        {started: true},
      );
      expect(mockUpdateSession).toHaveBeenCalledWith('some-session-id', {
        started: true,
      });
      expect(updatedSession).toEqual({
        id: 'some-session-id',
        started: true,
        hostProfile: {
          displayName: 'some-name',
          photoURL: 'some-photo-url',
        },
      });
    });
  });

  describe('updateExerciseState', () => {
    it('should throw if user is not the host', async () => {
      mockGetSessionById.mockResolvedValue({hostId: 'the-host-id'});
      await expect(
        updateExerciseState('not-the-host-id', 'some-session-id', {
          index: 1,
        }),
      ).rejects.toEqual(Error('user-unauthorized'));
    });

    it('should throw if session is not found', async () => {
      mockGetSessionById.mockResolvedValue(undefined);
      await expect(
        updateExerciseState('not-the-host-id', 'some-session-id', {
          index: 1,
        }),
      ).rejects.toEqual(Error('session-not-found'));
    });

    it('should update the session and return it', async () => {
      mockGetSessionById.mockResolvedValueOnce({
        id: 'some-session-id',
        dailyRoomName: 'some-daily-room-name',
        hostId: 'the-host-id',
      });
      mockGetSessionById.mockResolvedValueOnce({
        id: 'some-session-id',
        exerciseState: {index: 1},
      }); // second call (returned value)

      const updatedSession = await updateExerciseState(
        'the-host-id',
        'some-session-id',
        {index: 1},
      );
      expect(mockUpdateExerciseState).toHaveBeenCalledWith('some-session-id', {
        index: 1,
      });
      expect(updatedSession).toEqual({
        id: 'some-session-id',
        exerciseState: {index: 1},
        hostProfile: {
          displayName: 'some-name',
          photoURL: 'some-photo-url',
        },
      });
    });
  });
});
