import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {act, renderHook} from '@testing-library/react-hooks';
import {logEvent} from '../../metrics';
import useUserState from '../state/state';
import usePinCollection from './usePinCollection';

const mockLogEvent = jest.mocked(logEvent);

jest.mock('../../metrics');

jest.mock(
  '../../content/hooks/useGetCollectionById',
  () => () =>
    jest
      .fn()
      .mockReturnValueOnce({id: 'some-collection-id'})
      .mockReturnValueOnce({id: 'some-other-collection-id'}),
);

describe('usePinCollection', () => {
  it('should add collection as pinned', async () => {
    useUserState.setState({
      user: {uid: 'user-id'} as FirebaseAuthTypes.User,
      userState: {},
    });

    const {result} = renderHook(() => usePinCollection('some-collection-id'));

    await act(async () => {
      await result.current.togglePinned();
    });

    expect(result.current.isPinned).toBe(true);
    expect(useUserState.getState().userState).toEqual(
      expect.objectContaining({
        'user-id': {
          pinnedCollections: [
            {id: 'some-collection-id', startedAt: expect.any(String)},
          ],
        },
      }),
    );
    expect(mockLogEvent).toHaveBeenCalledTimes(1);
    expect(mockLogEvent).toHaveBeenCalledWith('Add Collection To Journey', {
      'Collection ID': 'some-collection-id',
    });
  });

  it('should remove collection as pinned', () => {
    useUserState.setState({
      user: {uid: 'user-id'} as FirebaseAuthTypes.User,
      userState: {
        'user-id': {
          pinnedCollections: [
            {id: 'some-collection-id', startedAt: new Date().toISOString()},
            {
              id: 'some-other-collection-id',
              startedAt: new Date().toISOString(),
            },
          ],
        },
      },
    });

    const {result} = renderHook(() => usePinCollection('some-collection-id'));

    act(() => {
      result.current.togglePinned();
    });

    expect(result.current.isPinned).toBe(false);
    expect(useUserState.getState().userState).toEqual(
      expect.objectContaining({
        'user-id': {
          pinnedCollections: [
            {id: 'some-other-collection-id', startedAt: expect.any(String)},
          ],
        },
      }),
    );
  });
});
