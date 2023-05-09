import {renderHook, act} from '@testing-library/react-hooks';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import useAuthenticateUser from './useAuthenticateUser';
import useUserState from '../state/state';
import {getMe} from '../api/user';

jest.mock('../api/user');

afterEach(() => {
  jest.clearAllMocks();
});

describe('useAuthenticateUser', () => {
  it('should set user state if user is authenticated', async () => {
    jest.mocked(auth().currentUser?.getIdTokenResult)?.mockResolvedValue({
      claims: {
        someClaim: 'some-value',
      },
    } as unknown as FirebaseAuthTypes.IdTokenResult);
    jest.mocked(getMe).mockResolvedValueOnce({});

    let userChangedCallback = (user: FirebaseAuthTypes.User | null) => user;
    (auth().onUserChanged as jest.Mock).mockImplementationOnce(
      callback => (userChangedCallback = callback),
    );

    const useTestHook = () => {
      useAuthenticateUser();
      const user = useUserState(state => state.user);
      const userState = useUserState(state => state.userState);

      return {user, userState};
    };

    const {result} = renderHook(useTestHook);

    await act(async () => {
      await userChangedCallback({
        ...auth().currentUser,
        uid: 'some-user-id',
        isAnonymous: false,
      } as FirebaseAuthTypes.User);
    });

    expect(auth().onUserChanged).toHaveBeenCalledTimes(1);
    expect(result.current.user).toEqual({
      ...auth().currentUser,
      uid: 'some-user-id',
      isAnonymous: false,
    });
    expect(result.current.userState['some-user-id']).toBe(undefined);
  });

  it('should set initial user state if user is anonymous', async () => {
    jest.mocked(auth().currentUser?.getIdTokenResult)?.mockResolvedValue({
      claims: {
        someClaim: 'some-value',
      },
    } as unknown as FirebaseAuthTypes.IdTokenResult);
    jest.mocked(getMe).mockResolvedValueOnce({});

    let userChangedCallback = (user: FirebaseAuthTypes.User | null) => user;
    (auth().onUserChanged as jest.Mock).mockImplementationOnce(
      callback => (userChangedCallback = callback),
    );

    const useTestHook = () => {
      useAuthenticateUser();
      const user = useUserState(state => state.user);
      const userState = useUserState(state => state.userState);

      return {user, userState};
    };

    const {result} = renderHook(useTestHook);

    await act(async () => {
      await userChangedCallback({
        ...auth().currentUser,
        uid: 'some-user-id',
        isAnonymous: true,
      } as FirebaseAuthTypes.User);
    });

    expect(auth().onUserChanged).toHaveBeenCalledTimes(1);
    expect(result.current.user).toEqual({
      ...auth().currentUser,
      uid: 'some-user-id',
      isAnonymous: true,
    });
    expect(result.current.userState['some-user-id'].pinnedCollections).toEqual([
      {
        id: '46f653cd-b77f-458d-a257-1b171591c08b',
        startedAt: expect.any(String),
      },
    ]);
  });

  it('should reset user state if user gets logged out', () => {
    useUserState.setState({
      user: {
        uid: 'some-user-id',
      } as FirebaseAuthTypes.User,
    });
    jest.mocked(getMe).mockResolvedValueOnce({});

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

  it('should fetch user data if uid changed', async () => {
    useUserState.setState({
      user: {
        uid: 'some-user-id',
      } as FirebaseAuthTypes.User,
    });
    jest.mocked(getMe).mockResolvedValueOnce({description: 'some description'});

    const useTestHook = () => {
      useAuthenticateUser();
      const data = useUserState(state => state.data);

      return data;
    };

    await act(async () => {
      const rendered = renderHook(useTestHook);
      await rendered.waitForValueToChange(
        () => rendered.result.current?.description,
      );
      expect(rendered.result.current?.description).toEqual('some description');
    });
  });

  it('should not fetch user data if uid is undefined', async () => {
    useUserState.setState({
      user: null,
    });

    const useTestHook = () => {
      useAuthenticateUser();
      const data = useUserState(state => state.data);

      return data;
    };

    renderHook(useTestHook);
    expect(jest.mocked(getMe)).toHaveBeenCalledTimes(0);
  });
});
