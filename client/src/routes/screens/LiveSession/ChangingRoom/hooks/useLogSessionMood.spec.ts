import {renderHook} from '@testing-library/react-hooks';
import {LiveSessionType} from '../../../../../../../shared/src/schemas/Session';
import {logEvent} from '../../../../../lib/metrics';
import useSessionState from '../../../../../lib/session/state/state';
import useLogSessionMood from './useLogSessionMood';

const mockT = jest.fn().mockReturnValue('Some translated string');
jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({
    t: mockT,
  })),
}));

const mockLogEvent = jest.mocked(logEvent);
jest.mock('../../../../../lib/metrics');

const mockAddUserEvent = jest.fn();
jest.mock(
  '../../../../../lib/user/hooks/useAddUserEvent',
  () => () => mockAddUserEvent,
);

afterEach(jest.clearAllMocks);

describe('useLogSessionMood', () => {
  it('should log session mood', () => {
    useSessionState.setState({
      mood: 1.5,
      liveSession: {
        id: 'some-session-id',
        exerciseId: 'some-exercise-id',
      } as LiveSessionType,
    });

    const {result} = renderHook(() => useLogSessionMood());

    result.current();

    expect(mockT).toHaveBeenCalledTimes(2);

    expect(mockT).toHaveBeenCalledWith('question', {lng: 'en'});
    expect(mockLogEvent).toHaveBeenCalledTimes(1);
    expect(mockLogEvent).toHaveBeenCalledWith('Answer Sharing Session Mood', {
      'Sharing Session Mood Question': 'Some translated string',
      'Sharing Session Mood': 1.5,
    });

    expect(mockT).toHaveBeenCalledWith('question');
    expect(mockAddUserEvent).toHaveBeenCalledTimes(1);
    expect(mockAddUserEvent).toHaveBeenCalledWith('mood', {
      type: 'liveSession',
      question: 'Some translated string',
      mood: 1.5,
      sessionId: 'some-session-id',
      exerciseId: 'some-exercise-id',
    });
  });

  it('should not log anything if mood is not set', () => {
    useSessionState.setState({
      mood: null,
      liveSession: {
        id: 'some-session-id',
        exerciseId: 'some-exercise-id',
      } as LiveSessionType,
    });

    const {result} = renderHook(() => useLogSessionMood());

    result.current();

    expect(mockT).toHaveBeenCalledTimes(0);
    expect(mockLogEvent).toHaveBeenCalledTimes(0);
    expect(mockAddUserEvent).toHaveBeenCalledTimes(0);
  });

  it('should not log anything if liveSession is not set', () => {
    useSessionState.setState({
      mood: 1.5,
      liveSession: null,
    });

    const {result} = renderHook(() => useLogSessionMood());

    result.current();

    expect(mockT).toHaveBeenCalledTimes(0);
    expect(mockLogEvent).toHaveBeenCalledTimes(0);
    expect(mockAddUserEvent).toHaveBeenCalledTimes(0);
  });
});
