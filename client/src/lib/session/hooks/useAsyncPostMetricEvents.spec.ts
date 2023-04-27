import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {renderHook} from '@testing-library/react-hooks';
import {AsyncSession} from '../../../../../shared/src/schemas/Session';
import {logEvent} from '../../metrics';
import useUserState from '../../user/state/state';
import useSessionState from '../state/state';
import useAsyncPostMetricEvents from './useAsyncPostMetricEvents';

jest.mock('../../../lib/metrics');

jest.mock('../../../lib/content/hooks/useExerciseById', () => () => ({
  id: 'some-exercise-id',
  slides: ['slide 1', 'slide 2', 'slide 3'],
}));

const mockedLogEvent = jest.mocked(logEvent);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('useAsyncPostMetricEvents', () => {
  it('logs events with specific properties', () => {
    useUserState.setState({
      user: {
        uid: 'some-user-id',
      } as FirebaseAuthTypes.User,
    });

    useSessionState.setState({
      asyncSession: {
        id: 'some-session-id',
        type: 'private',
        mode: 'async',
        startTime: '2022-02-02T02:02:02Z',
        exerciseId: 'some-exercise-id',
        language: 'en',
      } as AsyncSession,
    });

    const {result} = renderHook(() => useAsyncPostMetricEvents());

    result.current('Create Async Post', true, true);

    expect(mockedLogEvent).toHaveBeenCalledTimes(1);
    expect(mockedLogEvent).toHaveBeenCalledWith('Create Async Post', {
      'Sharing Session ID': 'some-session-id',
      'Sharing Session Type': 'private',
      'Sharing Session Mode': 'async',
      'Sharing Session Start Time': '2022-02-02T02:02:02Z',
      'Exercise ID': 'some-exercise-id',
      Language: 'en',
      Host: false,
      'Sharing Session Post Public': true,
      'Sharing Session Post Anonymous': true,
    });
  });
});
