import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {renderHook, act} from '@testing-library/react-hooks';
import MockDate from 'mockdate';
import {LiveSessionType} from '../../../../../shared/src/schemas/Session';
import useUserState from '../../user/state/state';
import {updateInterestedCount} from '../api/session';
import usePinSession from './usePinSession';

const mockNow = new Date('2022-12-10T10:00:00');
MockDate.set(mockNow); // Date.now()

jest.mock('../api/session');
const mockUpdateInterestedCount = updateInterestedCount as jest.Mock;
const mockLogSessionMetricEvent = jest.fn();
jest.mock('./useLogSessionMetricEvents', () => () => mockLogSessionMetricEvent);
const mockConfirmToggleReminder = jest.fn();
jest.mock('./useConfirmSessionReminder', () => () => mockConfirmToggleReminder);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('usePinSession', () => {
  describe('isPinned', () => {
    it('should return true when session is pinnded', () => {
      useUserState.setState({
        user: {uid: 'user-id'} as FirebaseAuthTypes.User,
        userState: {
          'user-id': {
            pinnedSessions: [
              {id: 'session-id-1', expires: new Date('2022-12-20')},
            ],
          },
        },
      });

      const {result} = renderHook(() =>
        usePinSession({id: 'session-id-1'} as LiveSessionType),
      );

      expect(result.current.isPinned).toBe(true);
    });

    it('should return false when session is not pinnded', () => {
      useUserState.setState({
        user: {uid: 'user-id'} as FirebaseAuthTypes.User,
        userState: {
          'user-id': {
            pinnedSessions: [
              {id: 'session-id-1', expires: new Date('2022-12-20')},
            ],
          },
        },
      });

      const {result} = renderHook(() =>
        usePinSession({id: 'session-id-2'} as LiveSessionType),
      );

      expect(result.current.isPinned).toBe(false);
    });
  });

  describe('togglePin', () => {
    it('should add session as pinned', async () => {
      useUserState.setState({
        user: {uid: 'user-id'} as FirebaseAuthTypes.User,
        userState: {},
      });

      const {result} = renderHook(() =>
        usePinSession({id: 'session-id-1'} as LiveSessionType),
      );

      act(() => {
        result.current.togglePinned();
      });

      expect(useUserState.getState().userState).toEqual(
        expect.objectContaining({
          'user-id': {
            pinnedSessions: [
              {id: 'session-id-1', expires: new Date('2023-01-10T10:00:00')},
            ],
          },
        }),
      );
      expect(mockConfirmToggleReminder).toHaveBeenCalledTimes(1);
      expect(mockConfirmToggleReminder).toHaveBeenCalledWith(true);
      expect(mockLogSessionMetricEvent).toHaveBeenCalledTimes(1);
      expect(mockUpdateInterestedCount).toHaveBeenCalledTimes(1);
      expect(mockUpdateInterestedCount).toHaveBeenCalledWith(
        'session-id-1',
        true,
      );
    });

    it('should remove existing session as pinned', async () => {
      useUserState.setState({
        user: {uid: 'user-id'} as FirebaseAuthTypes.User,
        userState: {
          'user-id': {
            pinnedSessions: [
              {id: 'session-id-1', expires: new Date('2022-12-20')},
            ],
          },
        },
      });

      const {result} = renderHook(() =>
        usePinSession({id: 'session-id-1'} as LiveSessionType),
      );

      act(() => {
        result.current.togglePinned();
      });

      expect(useUserState.getState().userState).toEqual(
        expect.objectContaining({
          'user-id': {
            pinnedSessions: [],
          },
        }),
      );
      expect(mockConfirmToggleReminder).toHaveBeenCalledTimes(1);
      expect(mockConfirmToggleReminder).toHaveBeenCalledWith(false);
      expect(mockLogSessionMetricEvent).toHaveBeenCalledTimes(0);
      expect(mockUpdateInterestedCount).toHaveBeenCalledTimes(1);
      expect(mockUpdateInterestedCount).toHaveBeenCalledWith(
        'session-id-1',
        false,
      );
    });

    it('should remove expired session as pinned on toggle on', async () => {
      useUserState.setState({
        user: {uid: 'user-id'} as FirebaseAuthTypes.User,
        userState: {
          'user-id': {
            pinnedSessions: [
              {id: 'session-id-1', expires: new Date('2022-11-09')},
            ],
          },
        },
      });

      const {result} = renderHook(() =>
        usePinSession({id: 'session-id-2'} as LiveSessionType),
      );

      act(() => {
        result.current.togglePinned();
      });

      expect(useUserState.getState().userState).toEqual(
        expect.objectContaining({
          'user-id': {
            pinnedSessions: [
              {id: 'session-id-2', expires: new Date('2023-01-10T10:00:00')},
            ],
          },
        }),
      );
    });

    it('should remove expired session as pinned on toggle off', async () => {
      useUserState.setState({
        user: {uid: 'user-id'} as FirebaseAuthTypes.User,
        userState: {
          'user-id': {
            pinnedSessions: [
              {id: 'session-id-1', expires: new Date('2022-11-09')},
              {id: 'session-id-2', expires: new Date('2022-12-20')},
            ],
          },
        },
      });

      const {result} = renderHook(() =>
        usePinSession({id: 'session-id-2'} as LiveSessionType),
      );

      act(() => {
        result.current.togglePinned();
      });

      expect(useUserState.getState().userState).toEqual(
        expect.objectContaining({
          'user-id': {
            pinnedSessions: [],
          },
        }),
      );
    });
  });
});
