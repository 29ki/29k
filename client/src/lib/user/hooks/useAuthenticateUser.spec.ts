import {renderHook} from '@testing-library/react-hooks';
import auth from '@react-native-firebase/auth';
import useAuthenticateUser from './useAuthenticateUser';
import {RecoilRoot, useRecoilValue} from 'recoil';
import {userAtom} from '../state/state';

afterEach(() => {
  jest.clearAllMocks();
});

describe('useAuthenticateUser', () => {
  it('should sign in anonymously if user is not authenticated', () => {
    (auth().onAuthStateChanged as jest.Mock).mockImplementationOnce(callback =>
      callback(null),
    );

    renderHook(() => useAuthenticateUser());

    expect(auth().onAuthStateChanged).toHaveBeenCalledTimes(1);
    expect(auth().signInAnonymously).toHaveBeenCalledTimes(1);
  });

  it('should set user state if user is authenticated', () => {
    (auth().onAuthStateChanged as jest.Mock).mockImplementationOnce(callback =>
      callback({uid: 'some-user-id'}),
    );

    const useTestHook = () => {
      useAuthenticateUser();
      const user = useRecoilValue(userAtom);

      return user;
    };

    const {result} = renderHook(useTestHook, {wrapper: RecoilRoot});

    expect(auth().onAuthStateChanged).toHaveBeenCalledTimes(1);
    expect(auth().signInAnonymously).toHaveBeenCalledTimes(0);
    expect(result.current).toEqual({uid: 'some-user-id'});
  });

  it('should unsubscribe on unmount', () => {
    const mockUnsubscribe = jest.fn();
    (auth().onAuthStateChanged as jest.Mock).mockImplementationOnce(
      () => mockUnsubscribe,
    );

    const {unmount} = renderHook(() => useAuthenticateUser());

    unmount();

    expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
  });
});
