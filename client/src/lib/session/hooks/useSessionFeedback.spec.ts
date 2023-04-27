import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {renderHook, act} from '@testing-library/react-hooks';

import useUserState from '../../user/state/state';
import useSessionFeedback from './useSessionFeedback';
import {logFeedback} from '../../metrics';
import {
  SessionMode,
  SessionType,
} from '../../../../../shared/src/schemas/Session';

jest.mock('../../metrics');
const mockedLogEvent = jest.mocked(logFeedback);

afterEach(() => {
  jest.clearAllMocks();
});

describe('useSessionFeedback', () => {
  describe('addSessionFeedback', () => {
    const {result} = renderHook(() => useSessionFeedback());

    it('should return log a metric event', async () => {
      act(() => {
        result.current.addSessionFeedback({
          sessionId: 'session-id',
          exerciseId: 'exercise-id',
          answer: true,
          completed: true,
          comment: 'comment',
          question: 'question',
          host: true,
          sessionType: SessionType.public,
          sessionMode: SessionMode.live,
        });
      });

      expect(mockedLogEvent).toHaveBeenCalledTimes(1);
      expect(mockedLogEvent).toHaveBeenCalledWith({
        answer: true,
        comment: 'comment',
        completed: true,
        exerciseId: 'exercise-id',
        host: true,
        question: 'question',
        sessionId: 'session-id',
        sessionType: SessionType.public,
        sessionMode: SessionMode.live,
      });
    });

    it('should add the feedback to user events', async () => {
      useUserState.setState({
        user: {uid: 'some-user-id'} as FirebaseAuthTypes.User,
        userState: {
          'some-user-id': {},
        },
      });
      act(() => {
        result.current.addSessionFeedback({
          sessionId: 'session-id',
          exerciseId: 'exercise-id',
          answer: true,
          completed: true,
          comment: 'comment',
          question: 'question',
          host: true,
          sessionType: SessionType.public,
          sessionMode: SessionMode.live,
        });
      });

      expect(
        useUserState.getState().userState['some-user-id'].userEvents,
      ).toEqual([
        {
          payload: {
            answer: true,
            comment: 'comment',
            exerciseId: 'exercise-id',
            sessionId: 'session-id',
            question: 'question',
          },
          timestamp: expect.any(String),
          type: 'feedback',
        },
      ]);
    });
  });
});
