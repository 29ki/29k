import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {renderHook} from '@testing-library/react-hooks';
import {getUser} from '../api/user';

import useUserState from '../state/state';
import useUserProfile from './useUserProfile';

jest.mock('../api/user');
const mockGetUser = jest.mocked(getUser);

afterEach(jest.clearAllMocks);

describe('useUserProfile', () => {
  it('should request user profile data', async () => {
    mockGetUser.mockResolvedValueOnce({
      displayName: 'some-display-name',
      photoURL: 'some-photo-url',
      uid: 'some-user-id',
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
      uid: 'some-user-id',
    });
    expect(mockGetUser).toHaveBeenCalledTimes(1);
    expect(mockGetUser).toHaveBeenCalledWith('some-user-id');
  });
});
