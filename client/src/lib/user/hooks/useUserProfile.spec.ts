import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {renderHook} from '@testing-library/react-hooks';
import useGet from '../../apiClient/useGet';

import useUserState from '../state/state';
import useUserProfile from './useUserProfile';

jest.mock('../../apiClient/useGet');
const mockedUseGet = jest.mocked(useGet);

afterEach(jest.clearAllMocks);

describe('useUserProfile', () => {
  it('should return user state profile data instead of making a request', () => {
    mockedUseGet.mockReturnValueOnce({
      data: undefined,
      error: undefined,
    });
    useUserState.setState({
      user: {
        uid: 'user-id',
        displayName: 'display-name',
        photoURL: 'photo-url',
      } as FirebaseAuthTypes.User,
    });

    const {result} = renderHook(() => useUserProfile('user-id'));

    expect(result.current).toEqual({
      displayName: 'display-name',
      photoURL: 'photo-url',
    });
    expect(mockedUseGet).toHaveBeenCalledTimes(1);
    expect(mockedUseGet).toHaveBeenCalledWith('/user/user-id', {skip: true});
  });

  it('should request user profile data', async () => {
    mockedUseGet.mockReturnValueOnce({
      data: {
        displayName: 'some-display-name',
        photoURL: 'some-photo-url',
      },
      error: undefined,
    });
    useUserState.setState({
      user: {
        uid: 'user-id',
        displayName: 'display-name',
        photoURL: 'photo-url',
      } as FirebaseAuthTypes.User,
    });

    const {result} = renderHook(() => useUserProfile('some-user-id'));

    expect(result.current).toEqual({
      displayName: 'some-display-name',
      photoURL: 'some-photo-url',
    });
    expect(mockedUseGet).toHaveBeenCalledTimes(1);
    expect(mockedUseGet).toHaveBeenCalledWith('/user/some-user-id', {
      skip: false,
    });
  });
});
