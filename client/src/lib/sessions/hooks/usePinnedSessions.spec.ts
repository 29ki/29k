import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {renderHook, act} from '@testing-library/react-hooks';
import MockDate from 'mockdate';
import {Session} from '../../../../../shared/src/types/Session';
import useUserState from '../../user/state/state';
import {updateInterestedCount} from '../api/session';
import usePinnedSessons from './usePinnedSessions';

const mockNow = new Date('2022-12-10T10:00:00');
MockDate.set(mockNow); // Date.now()

jest.mock('../api/session');
const mockUpdateInterestedCount = updateInterestedCount as jest.Mock;
const mockLogSessionMetricEvent = jest.fn();
jest.mock('./useLogSessionMetricEvents', () => () => mockLogSessionMetricEvent);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('usePinnedSessions', () => {
  describe('isSessionPinned', () => {
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

      const {result} = renderHook(() => usePinnedSessons());

      expect(
        result.current.isSessionPinned({id: 'session-id-1'} as Session),
      ).toBe(true);
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

      const {result} = renderHook(() => usePinnedSessons());

      expect(
        result.current.isSessionPinned({id: 'session-id-2'} as Session),
      ).toBe(false);
    });

    describe('togglePinSession', () => {
      it('should add session as pinned', async () => {
        useUserState.setState({
          user: {uid: 'user-id'} as FirebaseAuthTypes.User,
          userState: {},
        });

        const {result} = renderHook(() => usePinnedSessons());

        act(() => {
          result.current.togglePinSession({id: 'session-id-1'} as Session);
        });

        expect(result.current.pinnedSessions).toEqual([
          {id: 'session-id-1', expires: new Date('2023-01-10T10:00:00')},
        ]);
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

        const {result} = renderHook(() => usePinnedSessons());

        act(() => {
          result.current.togglePinSession({id: 'session-id-1'} as Session);
        });

        expect(result.current.pinnedSessions).toEqual([]);
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

        const {result} = renderHook(() => usePinnedSessons());

        act(() => {
          result.current.togglePinSession({id: 'session-id-2'} as Session);
        });

        expect(result.current.pinnedSessions).toEqual([
          {id: 'session-id-2', expires: new Date('2023-01-10T10:00:00')},
        ]);
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

        const {result} = renderHook(() => usePinnedSessons());

        act(() => {
          result.current.togglePinSession({id: 'session-id-2'} as Session);
        });

        expect(result.current.pinnedSessions).toEqual([]);
      });
    });
  });
});
