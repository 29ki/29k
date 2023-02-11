import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {renderHook} from '@testing-library/react-hooks';
import MockDate from 'mockdate';
import useUserState from '../../user/state/state';
import usePinnedSessions from './usePinnedSessions';

const mockNow = new Date('2022-12-10T10:00:00');
MockDate.set(mockNow); // Date.now()

jest.mock('../../session/api/session');
const mockLogSessionMetricEvent = jest.fn();
jest.mock('./useLogSessionMetricEvents', () => () => mockLogSessionMetricEvent);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('usePinnedSessions', () => {
  it('should return pinned session', () => {
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

    const {result} = renderHook(() => usePinnedSessions());

    expect(result.current).toEqual([
      {id: 'session-id-1', expires: new Date('2022-12-20')},
    ]);
  });

  it('should return empty array when no pinned sessions', () => {
    const {result} = renderHook(() => usePinnedSessions());

    expect(result.current).toEqual([]);
  });
});
