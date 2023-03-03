import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {renderHook} from '@testing-library/react-hooks';
import useUserState from '../state/state';
import usePinnedCollections from './usePinnedCollections';

jest.mock(
  '../../content/hooks/useGetCollectionById',
  () => () =>
    jest
      .fn()
      .mockReturnValueOnce({id: 'some-collection-id'})
      .mockReturnValueOnce(null),
);

describe('usePinnedCollections', () => {
  it('return pinned collections that exists in content', () => {
    useUserState.setState({
      user: {uid: 'user-id'} as FirebaseAuthTypes.User,
      userState: {
        'user-id': {
          pinnedCollections: [
            {id: 'some-collection-id', startedAt: new Date().toISOString()},
            {
              id: 'some-removed-collection-id',
              startedAt: new Date().toISOString(),
            },
          ],
        },
      },
    });

    const {result} = renderHook(() => usePinnedCollections());

    expect(result.current.pinnedCollections).toEqual([
      {
        id: 'some-collection-id',
        startedAt: expect.any(String),
      },
    ]);
  });
});
