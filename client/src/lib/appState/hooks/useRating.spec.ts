import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {act, renderHook} from '@testing-library/react-hooks';
import {FeedbackEvent} from '../../../../../shared/src/types/Event';
import useUserState from '../../user/state/state';
import useAppState, {APP_RATING_REVISION} from '../state/state';
import useRating from './useRating';

// TODO remove when iOS app goes live
jest.mock('react-native', () => {
  const reactNative = jest.requireActual('react-native');
  reactNative.Platform.OS = 'android';
  return reactNative;
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('useRating', () => {
  it('should ask for rating if not already given', () => {
    useAppState.setState({
      settings: {
        appRatedRevision: APP_RATING_REVISION - 1,
        showWelcome: false,
        showHiddenContent: false,
      },
    });
    useUserState.setState({
      user: {uid: 'some-user-id'} as FirebaseAuthTypes.User,
      userState: {
        'some-user-id': {
          userEvents: [
            {
              type: 'feedback',
              payload: {sessionId: 'some-session-id', answer: true},
            } as FeedbackEvent,
          ],
        },
      },
    });

    const {result} = renderHook(() => useRating());

    act(() => {
      expect(result.current('some-session-id')).toBe(true);
    });
  });

  it('should not ask for rating answer is false', () => {
    useAppState.setState({
      settings: {
        appRatedRevision: APP_RATING_REVISION - 1,
        showWelcome: false,
        showHiddenContent: false,
      },
    });
    useUserState.setState({
      user: {uid: 'some-user-id'} as FirebaseAuthTypes.User,
      userState: {
        'some-user-id': {
          userEvents: [
            {
              type: 'feedback',
              payload: {sessionId: 'some-session-id', answer: false},
            } as FeedbackEvent,
          ],
        },
      },
    });

    const {result} = renderHook(() => useRating());

    act(() => {
      expect(result.current('some-session-id')).toBe(false);
    });
  });

  it('should not ask for rating if already given', () => {
    useAppState.setState({
      settings: {
        appRatedRevision: APP_RATING_REVISION,
        showWelcome: false,
        showHiddenContent: false,
      },
    });
    useUserState.setState({
      user: {uid: 'some-user-id'} as FirebaseAuthTypes.User,
      userState: {
        'some-user-id': {
          userEvents: [
            {
              type: 'feedback',
              payload: {sessionId: 'some-session-id', answer: true},
            } as FeedbackEvent,
          ],
        },
      },
    });

    const {result} = renderHook(() => useRating());

    act(() => {
      expect(result.current('some-session-id')).toBe(false);
    });
  });

  it('should not ask for rating if no feedback given', () => {
    useAppState.setState({
      settings: {
        appRatedRevision: APP_RATING_REVISION - 1,
        showWelcome: false,
        showHiddenContent: false,
      },
    });
    useUserState.setState({
      user: {uid: 'some-user-id'} as FirebaseAuthTypes.User,
    });

    const {result} = renderHook(() => useRating());

    act(() => {
      expect(result.current('some-session-id')).toBe(false);
    });
  });
});
