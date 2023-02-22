import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {renderHook} from '@testing-library/react-hooks';
import {getProfile} from '../api/user';

import useUserState from '../state/state';
import useUserProfile from './useUserProfile';

jest.mock('../api/user');
const mockedGetProfile = jest.mocked(getProfile);

describe('useUserProfile', () => {
  it('should return user state profile data instead of making a request', () => {
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
    expect(mockedGetProfile).toHaveBeenCalledTimes(0);
  });

  it('should request user profile data', async () => {
    mockedGetProfile.mockResolvedValue({
      displayName: 'some-display-name',
      photoURL: 'some-photo-url',
    });
    useUserState.setState({
      user: {
        uid: 'user-id',
        displayName: 'display-name',
        photoURL: 'photo-url',
      } as FirebaseAuthTypes.User,
    });

    const {result} = renderHook(() => useUserProfile('some-user-id'));

    await result.current;
    expect(mockedGetProfile).toHaveBeenCalledTimes(1);
    expect(result.current).toEqual({
      displayName: 'some-display-name',
      photoURL: 'some-photo-url',
    });
  });
});
