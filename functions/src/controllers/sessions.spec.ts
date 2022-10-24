const mockDynamicLinks = {
  createDynamicLink: jest.fn().mockResolvedValue('http://some.dynamic/link'),
};
const mockDailyApi = {
  createRoom: jest.fn(() => ({
    id: 'some-fake-daily-id',
    url: 'http://fake.daily/url',
    name: 'some-fake-daily-room-name',
  })),
  deleteRoom: jest.fn(),
};

import * as sessionModel from '../models/session';
import {
  createSession,
  removeSession,
  updateExerciseState,
  updateSession,
} from './sessions';
import {SessionType} from '../../../shared/src/types/Session';
import dayjs from 'dayjs';

jest.mock('../lib/dailyApi', () => mockDailyApi);
jest.mock('../lib/dynamicLinks', () => mockDynamicLinks);
jest.mock('../models/session');

const mockAddSession = sessionModel.addSession as jest.Mock;
const mockGetSessionById = sessionModel.getSessionById as jest.Mock;
const mockDeleteSession = sessionModel.deleteSession as jest.Mock;
const mockUpdateSession = sessionModel.updateSession as jest.Mock;
const mockUpdateExerciseState = sessionModel.updateExerciseState as jest.Mock;

jest.useFakeTimers().setSystemTime(new Date('2022-10-10T09:00:00Z'));

beforeEach(async () => {
  jest.clearAllMocks();
});

describe('sessions - conroller', () => {
  describe('createSession', () => {
    it('should create a daily room that expires 2h after it starts', async () => {
      await createSession('some-user-id', {
        contentId: 'some-content-id',
        type: SessionType.public,
        startTime: new Date('2022-10-10T10:00:00Z').toISOString(),
      });

      const expireDate = dayjs('2022-10-10T12:00:00.000Z');
      expect(mockDailyApi.createRoom).toHaveBeenCalledWith(expireDate);
    });

    it('should create a dynamic link with correct path', async () => {
      await createSession('some-user-id', {
        contentId: 'some-content-id',
        type: SessionType.public,
        startTime: new Date('2022-10-10T10:00:00Z').toISOString(),
      });
      expect(mockDynamicLinks.createDynamicLink).toHaveBeenCalledWith(
        'sessions/some-fake-daily-id',
      );
    });

    it('should create and return a session', async () => {
      mockAddSession.mockResolvedValueOnce('add-session-resolved-value');
      const session = await createSession('some-user-id', {
        contentId: 'some-content-id',
        type: SessionType.public,
        startTime: new Date('2022-10-10T10:00:00Z').toISOString(),
      });

      expect(mockAddSession).toHaveBeenCalledWith({
        contentId: 'some-content-id',
        dailyRoomName: 'some-fake-daily-room-name',
        facilitator: 'some-user-id',
        id: 'some-fake-daily-id',
        link: 'http://some.dynamic/link',
        startTime: '2022-10-10T10:00:00.000Z',
        type: 'public',
        url: 'http://fake.daily/url',
      });
      expect(session).toBe('add-session-resolved-value');
    });
  });

  describe('removeSession', () => {
    it('should throw if user is not the host', async () => {
      mockGetSessionById.mockResolvedValue({facilitator: 'the-host-id'});
      await expect(
        removeSession('not-the-host-id', 'some-session-id'),
      ).rejects.toEqual(Error('user-unauthorized'));
    });

    it('should delete session and daily room', async () => {
      mockGetSessionById.mockResolvedValue({
        id: 'some-session-id',
        dailyRoomName: 'some-daily-room-name',
        facilitator: 'the-host-id',
      });

      await removeSession('the-host-id', 'some-session-id');

      expect(mockDailyApi.deleteRoom).toHaveBeenCalledWith(
        'some-daily-room-name',
      );
      expect(mockDeleteSession).toHaveBeenCalledWith('some-session-id');
    });
  });

  describe('updateSession', () => {
    it('should throw if user is not the host', async () => {
      mockGetSessionById.mockResolvedValue({facilitator: 'the-host-id'});
      await expect(
        updateSession('not-the-host-id', 'some-session-id', {started: true}),
      ).rejects.toEqual(Error('user-unauthorized'));
    });

    it('should update the session and return it', async () => {
      mockGetSessionById.mockResolvedValueOnce({
        id: 'some-session-id',
        dailyRoomName: 'some-daily-room-name',
        facilitator: 'the-host-id',
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
      });
    });
  });

  describe('updateExerciseState', () => {
    it('should throw if user is not the host', async () => {
      mockGetSessionById.mockResolvedValue({facilitator: 'the-host-id'});
      await expect(
        updateExerciseState('not-the-host-id', 'some-session-id', {
          index: 1,
        }),
      ).rejects.toEqual(Error('user-unauthorized'));
    });

    it('should update the session and return it', async () => {
      mockGetSessionById.mockResolvedValueOnce({
        id: 'some-session-id',
        dailyRoomName: 'some-daily-room-name',
        facilitator: 'the-host-id',
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
      });
    });
  });
});
