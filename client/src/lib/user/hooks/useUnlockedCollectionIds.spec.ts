import {renderHook} from '@testing-library/react-hooks';
import useUserState from '../state/state';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import useUnlockedCollectionIds from './useUnlockedCollectionIds';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('useUnlockedCollectionIds', () => {
  it('returns unlocked collections IDs from user state', () => {
    useUserState.setState({
      user: {uid: 'some-user-id'} as FirebaseAuthTypes.User,
      userState: {
        'some-user-id': {
          unlockedCollectionIds: [
            'some-collection-id',
            'some-other-collection-id',
          ],
        },
      },
    });

    const {result} = renderHook(() => useUnlockedCollectionIds());

    expect(result.current).toEqual([
      'some-collection-id',
      'some-other-collection-id',
    ]);
  });
});
