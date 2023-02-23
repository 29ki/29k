import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {renderHook} from '@testing-library/react-hooks';
import {getProfile} from '../api/user';

import useUserState from '../state/state';
import useUserProfile from './useUserProfile';

jest.mock('../api/user');
const mockGetProfile = jest.mocked(getProfile);

afterEach(jest.clearAllMocks);

describe('useUserProfile', () => {
  it('should return user state data', async () => {
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
    expect(mockGetProfile).toHaveBeenCalledTimes(0);
  });

  it('should request user profile data', async () => {
    mockGetProfile.mockResolvedValueOnce({
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

    const {result, waitForNextUpdate} = renderHook(() =>
      useUserProfile('some-user-id'),
    );

    await waitForNextUpdate();
    expect(result.current).toEqual({
      displayName: 'some-display-name',
      photoURL: 'some-photo-url',
    });
    expect(mockGetProfile).toHaveBeenCalledTimes(1);
    expect(mockGetProfile).toHaveBeenCalledWith('some-user-id');
  });
});
