import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {renderHook} from '@testing-library/react-hooks';
import {Session} from '../../../../../shared/src/types/Session';
import {logEvent} from '../../metrics';
import useUserState from '../../user/state/state';
import useLogSessionMetricEvents from './useLogSessionMetricEvents';

jest.mock('../../../lib/metrics');

jest.mock('../../../lib/content/hooks/useExerciseById', () => () => ({
  id: 'some-exercise-id',
  slides: ['slide 1', 'slide 2', 'slide 3'],
}));

const mockedLogEvent = jest.mocked(logEvent);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('useLogSessionMetricEvents', () => {
  describe('logSessionMetricEvent', () => {
    it('logs events with specific properties', () => {
      useUserState.setState({
        user: {
          uid: 'some-user-id',
        } as FirebaseAuthTypes.User,
      });

      const {result} = renderHook(() => useLogSessionMetricEvents());

      result.current('Create Sharing Session', {
        id: 'some-session-id',
        type: 'private',
        hostId: 'some-host-id',
        startTime: '2022-02-02T02:02:02Z',
        exerciseId: 'some-content-id',
        language: 'en',
      } as Session);

      expect(mockedLogEvent).toHaveBeenCalledTimes(1);
      expect(mockedLogEvent).toHaveBeenCalledWith('Create Sharing Session', {
        'Sharing Session ID': 'some-session-id',
        'Sharing Session Type': 'private',
        'Sharing Session Mode': 'live',
        'Sharing Session Start Time': '2022-02-02T02:02:02Z',
        'Exercise ID': 'some-content-id',
        Language: 'en',
        Host: false,
      });
    });

    it('resolves the host event property', () => {
      useUserState.setState({
        user: {
          uid: 'some-user-id',
        } as FirebaseAuthTypes.User,
      });

      const {result} = renderHook(() => useLogSessionMetricEvents());

      result.current('Create Sharing Session', {
        id: 'some-session-id',
        hostId: 'some-user-id',
      } as Session);

      expect(mockedLogEvent).toHaveBeenCalledTimes(1);
      expect(mockedLogEvent).toHaveBeenCalledWith(
        'Create Sharing Session',
        expect.objectContaining({
          Host: true,
        }),
      );
    });
  });
});
