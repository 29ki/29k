import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {renderHook} from '@testing-library/react-hooks';

import useUserState from '../state/state';
import useGetSessionsByFeedback from './useGetSessionsByFeedback';
import {
  CompletedSessionPayload,
  FeedbackPayload,
} from '../../../../../shared/src/types/Event';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('useGetSessionsByFeedback', () => {
  beforeEach(() =>
    useUserState.setState({
      user: {uid: 'user-id'} as FirebaseAuthTypes.User,
      userState: {
        'user-id': {
          userEvents: [
            {
              type: 'feedback',
              payload: {
                sessionId: 'session-id-1',
                answer: true,
              } as FeedbackPayload,
              timestamp: new Date('2023-01-01').toISOString(),
            },
            {
              type: 'feedback',
              payload: {
                sessionId: 'session-id-2',
                answer: false,
              } as FeedbackPayload,
              timestamp: new Date('2023-01-01').toISOString(),
            },
            {
              type: 'completedSession',
              payload: {id: 'session-id-1'} as CompletedSessionPayload,
              timestamp: new Date().toISOString(),
            },
            {
              type: 'completedSession',
              payload: {id: 'session-id-2'} as CompletedSessionPayload,
              timestamp: new Date().toISOString(),
            },
          ],
        },
      },
    }),
  );

  it('should return all sessions that got a feedback', async () => {
    const {result} = renderHook(() => useGetSessionsByFeedback());
    expect(result.current()).toEqual([
      {
        payload: {id: 'session-id-1'},
        timestamp: expect.any(String),
        type: 'completedSession',
      },
      {
        payload: {id: 'session-id-2'},
        timestamp: expect.any(String),
        type: 'completedSession',
      },
    ]);
  });

  it('should return only sessions with respective feedbackAnswer', async () => {
    const {result} = renderHook(() => useGetSessionsByFeedback());
    expect(result.current(true)).toEqual([
      {
        payload: {id: 'session-id-1'},
        timestamp: expect.any(String),
        type: 'completedSession',
      },
    ]);
    expect(result.current(false)).toEqual([
      {
        payload: {id: 'session-id-2'},
        timestamp: expect.any(String),
        type: 'completedSession',
      },
    ]);
  });
});
