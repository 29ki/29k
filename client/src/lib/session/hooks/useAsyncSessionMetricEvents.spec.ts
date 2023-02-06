import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {renderHook} from '@testing-library/react-hooks';
import dayjs from 'dayjs';
import {AsyncSession} from '../../../../../shared/src/types/Session';
import {logEvent} from '../../metrics';
import useUserState from '../../user/state/state';
import useSessionState from '../state/state';
import useAsyncSessionMetricEvents from './useAsyncSessionMetricEvents';

jest.mock('../../../lib/metrics');

jest.mock('../../../lib/content/hooks/useExerciseById', () => () => ({
  id: 'some-exercise-id',
  slides: ['slide 1', 'slide 2', 'slide 3'],
}));

const mockedLogEvent = jest.mocked(logEvent);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('useAsyncSessionMetricEvents', () => {
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
        startTime: '2022-02-02T02:02:02Z',
        contentId: 'some-content-id',
        language: 'en',
      } as AsyncSession,
    });

    const {result} = renderHook(() => useAsyncSessionMetricEvents());

    result.current('Enter Intro Portal');

    expect(mockedLogEvent).toHaveBeenCalledTimes(1);
    expect(mockedLogEvent).toHaveBeenCalledWith('Enter Intro Portal', {
      'Sharing Session ID': 'some-session-id',
      'Sharing Session Type': 'private',
      'Sharing Session Mode': 'async',
      'Sharing Session Start Time': '2022-02-02T02:02:02Z',
      'Sharing Session Duration': expect.any(Number),
      'Exercise ID': 'some-content-id',
      Language: 'en',
      Host: false,
    });
  });

  it('resolves the duration event property', () => {
    useUserState.setState({
      user: {
        uid: 'some-user-id',
      } as FirebaseAuthTypes.User,
    });

    useSessionState.setState({
      asyncSession: {
        id: 'some-session-id',
        startTime: dayjs().subtract(1, 'hour').toISOString(),
      } as unknown as AsyncSession,
    });

    const {result} = renderHook(() => useAsyncSessionMetricEvents());

    result.current('Enter Intro Portal');

    expect(mockedLogEvent).toHaveBeenCalledTimes(1);
    expect(mockedLogEvent).toHaveBeenCalledWith(
      'Enter Intro Portal',
      expect.objectContaining({
        'Sharing Session Duration': 3600,
      }),
    );
  });
});
