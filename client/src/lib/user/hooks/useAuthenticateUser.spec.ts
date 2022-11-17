import {renderHook, act} from '@testing-library/react-hooks';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import useAuthenticateUser from './useAuthenticateUser';
import useUserState from '../state/state';

import * as metrics from '../../metrics';

jest.mock('../../metrics');

const mockMetrics = jest.mocked(metrics);

afterEach(() => {
  jest.clearAllMocks();
});

describe('useAuthenticateUser', () => {
  it('should set user state if user is authenticated', () => {
    (auth().onUserChanged as jest.Mock).mockImplementationOnce(callback =>
      callback({uid: 'some-user-id', isAnonymous: false}),
    );

    const useTestHook = () => {
      useAuthenticateUser();
      const user = useUserState(state => state.user);

      return user;
    };

    const {result} = renderHook(useTestHook);

    expect(auth().onUserChanged).toHaveBeenCalledTimes(1);
    expect(mockMetrics.setUserProperties).toHaveBeenCalledTimes(1);
    expect(mockMetrics.setUserProperties).toHaveBeenCalledWith({
      Anonymous: false,
    });
    expect(result.current).toEqual({
      uid: 'some-user-id',
      isAnonymous: false,
    });
  });

  it('should reset user state if user gets logged out', () => {
    useUserState.setState({
      user: {
        uid: 'some-user-id',
      } as FirebaseAuthTypes.User,
    });

    let userChangedCallback = (user: FirebaseAuthTypes.User | null) => user;
    (auth().onUserChanged as jest.Mock).mockImplementationOnce(
      callback => (userChangedCallback = callback),
    );

    const useTestHook = () => {
      useAuthenticateUser();
      const user = useUserState(state => state.user);

      return user;
    };

    const {result} = renderHook(useTestHook);

    expect(result.current).toEqual({
      uid: 'some-user-id',
    });

    act(() => {
      userChangedCallback(null);
    });

    expect(result.current).toEqual(null);
  });

  it('should unsubscribe on unmount', () => {
    const mockUnsubscribe = jest.fn();
    (auth().onUserChanged as jest.Mock).mockImplementationOnce(
      () => mockUnsubscribe,
    );

    const {unmount} = renderHook(() => useAuthenticateUser());

    unmount();

    expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
  });
});
