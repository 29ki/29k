import {renderHook} from '@testing-library/react-hooks';
import useLogMindfulMinutes from './useLogMindfulMinutes';
import * as mindfulMinutes from '../lib/logMindfulMinutes';
import useUserState from '../../user/state/state';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';

const mockIsAvailable = jest.mocked(mindfulMinutes.isAvailable);
const mockRequestAuthorization = jest.mocked(
  mindfulMinutes.requestAuthorization,
);
const mockGetAuthorizationStatus = jest.mocked(
  mindfulMinutes.getAuthorizationStatus,
);
const mockLog = jest.mocked(mindfulMinutes.log);
jest.mock('../lib/logMindfulMinutes');

jest.mock('../../metrics');

afterEach(jest.clearAllMocks);

describe('useLogMindfulMinutes', () => {
  describe('mindfulMinutesAvailable', () => {
    it('sets mindfulMinutesAvailable to true when available', async () => {
      mockIsAvailable.mockResolvedValueOnce(true);

      const {result, waitForNextUpdate} = renderHook(() =>
        useLogMindfulMinutes(),
      );

      await waitForNextUpdate();

      expect(result.current.mindfulMinutesAvailable).toBe(true);
    });

    it('sets mindfulMinutesAvailable to false when not available', async () => {
      mockIsAvailable.mockResolvedValueOnce(false);

      const {result} = renderHook(() => useLogMindfulMinutes());

      expect(result.current.mindfulMinutesAvailable).toBe(false);
    });
  });

  describe('mindfulMinutesEnabled', () => {
    it('sets mindfulMinutesEnabled to true when authorized and userState.logMindfulMinutes == true', async () => {
      mockGetAuthorizationStatus.mockResolvedValueOnce(true);
      useUserState.setState({
        user: {uid: 'some-user-id'} as FirebaseAuthTypes.User,
        userState: {
          'some-user-id': {
            logMindfulMinutes: true,
          },
        },
      });

      const {result, waitForNextUpdate} = renderHook(() =>
        useLogMindfulMinutes(),
      );

      await waitForNextUpdate();

      expect(result.current.mindfulMinutesEnabled).toBe(true);
    });

    it('sets mindfulMinutesEnabled to false when authorized and userState.logMindfulMinutes == false', async () => {
      mockGetAuthorizationStatus.mockResolvedValueOnce(true);
      useUserState.setState({
        user: {uid: 'some-user-id'} as FirebaseAuthTypes.User,
        userState: {
          'some-user-id': {
            logMindfulMinutes: false,
          },
        },
      });

      const {result, waitForNextUpdate} = renderHook(() =>
        useLogMindfulMinutes(),
      );

      await waitForNextUpdate();

      expect(result.current.mindfulMinutesEnabled).toBe(false);
    });

    it('sets mindfulMinutesEnabled to true when not authorized and userState.logMindfulMinutes == true', async () => {
      mockGetAuthorizationStatus.mockResolvedValueOnce(false);
      useUserState.setState({
        user: {uid: 'some-user-id'} as FirebaseAuthTypes.User,
        userState: {
          'some-user-id': {
            logMindfulMinutes: false,
          },
        },
      });

      const {result, waitForNextUpdate} = renderHook(() =>
        useLogMindfulMinutes(),
      );

      await waitForNextUpdate();

      expect(result.current.mindfulMinutesEnabled).toBe(false);
    });

    it('sets mindfulMinutesEnabled to false when not authorized and userState.logMindfulMinutes == true', async () => {
      mockGetAuthorizationStatus.mockResolvedValueOnce(false);
      useUserState.setState({
        user: {uid: 'some-user-id'} as FirebaseAuthTypes.User,
        userState: {
          'some-user-id': {
            logMindfulMinutes: false,
          },
        },
      });

      const {result, waitForNextUpdate} = renderHook(() =>
        useLogMindfulMinutes(),
      );

      await waitForNextUpdate();

      expect(result.current.mindfulMinutesEnabled).toBe(false);
    });

    it('sets mindfulMinutesEnabled to undefined when not userState.logMindfulMinutes == undefined', async () => {
      mockGetAuthorizationStatus.mockResolvedValueOnce(true);
      useUserState.setState({
        user: {uid: 'some-user-id'} as FirebaseAuthTypes.User,
        userState: {
          'some-user-id': {
            logMindfulMinutes: undefined,
          },
        },
      });

      const {result, waitForNextUpdate} = renderHook(() =>
        useLogMindfulMinutes(),
      );

      await waitForNextUpdate();

      expect(result.current.mindfulMinutesEnabled).toBe(undefined);
    });
  });

  describe('setMindfulMinutesEnabled', () => {
    it('requests authorization when enabling', async () => {
      useUserState.setState({
        user: {uid: 'some-user-id'} as FirebaseAuthTypes.User,
      });

      const {result} = renderHook(() => useLogMindfulMinutes());

      await result.current.setMindfulMinutesEnabled(true);

      expect(mockRequestAuthorization).toHaveBeenCalledTimes(1);
      expect(useUserState.getState().userState).toEqual({
        'some-user-id': {
          logMindfulMinutes: true,
        },
      });
    });

    it('does not request authorization when disabling', async () => {
      useUserState.setState({
        user: {uid: 'some-user-id'} as FirebaseAuthTypes.User,
      });

      const {result} = renderHook(() => useLogMindfulMinutes());

      await result.current.setMindfulMinutesEnabled(false);

      expect(mockRequestAuthorization).toHaveBeenCalledTimes(0);
      expect(useUserState.getState().userState).toEqual({
        'some-user-id': {
          logMindfulMinutes: false,
        },
      });
    });
  });

  describe('logMindfulMinutes', () => {
    it('logs mindful minutes when enabled', async () => {
      mockGetAuthorizationStatus.mockResolvedValueOnce(true);
      useUserState.setState({
        user: {uid: 'some-user-id'} as FirebaseAuthTypes.User,
        userState: {
          'some-user-id': {
            logMindfulMinutes: true,
          },
        },
      });

      const {result, waitForNextUpdate} = renderHook(() =>
        useLogMindfulMinutes(),
      );

      await waitForNextUpdate();

      await result.current.logMindfulMinutes(
        new Date('2001-01-01T01:01:01Z'),
        new Date('2002-02-02T02:02:02Z'),
      );

      expect(mockLog).toHaveBeenCalledTimes(1);
      expect(mockLog).toHaveBeenCalledWith(
        new Date('2001-01-01T01:01:01Z'),
        new Date('2002-02-02T02:02:02Z'),
      );
    });

    it('does not log mindful minutes when not enabled', async () => {
      mockGetAuthorizationStatus.mockResolvedValueOnce(false);
      useUserState.setState({
        user: {uid: 'some-user-id'} as FirebaseAuthTypes.User,
        userState: {
          'some-user-id': {
            logMindfulMinutes: false,
          },
        },
      });

      const {result, waitForNextUpdate} = renderHook(() =>
        useLogMindfulMinutes(),
      );

      await waitForNextUpdate();

      await result.current.logMindfulMinutes(
        new Date('2001-01-01T01:01:01Z'),
        new Date('2002-02-02T02:02:02Z'),
      );

      expect(mockLog).toHaveBeenCalledTimes(0);
    });
  });
});
