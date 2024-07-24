import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {act, renderHook} from '@testing-library/react-hooks';
import useUserState from '../../user/state/state';
import {enableFetchMocks} from 'jest-fetch-mock';
import {PostType} from '../../../../../shared/src/schemas/Post';
import useTogglePostRelate from './useTogglePostRelate';
import useRelatesState from '../state/state';

enableFetchMocks();

afterEach(() => {
  jest.clearAllMocks();
});

describe('useTogglePostRelate', () => {
  it('updates relates state on mount', async () => {
    renderHook(() =>
      useTogglePostRelate({id: 'some-post-id', relates: 1337} as PostType),
    );

    expect(useRelatesState.getState().relatesCount['some-post-id']).toBe(1337);
  });

  it('does not update relates state if already set', async () => {
    useRelatesState.setState({
      relatesCount: {'some-post-id': 1337},
    });

    renderHook(() =>
      useTogglePostRelate({id: 'some-post-id', relates: 2} as PostType),
    );

    expect(useRelatesState.getState().relatesCount['some-post-id']).toBe(1337);
  });

  describe('relatesCount', () => {
    it('equals post relates count if no relates state is set', async () => {
      const {result} = renderHook(() =>
        useTogglePostRelate({id: 'some-post-id', relates: 1337} as PostType),
      );

      expect(result.current.relatesCount).toBe(1337);
    });

    it('equals the relates state', () => {
      useRelatesState.setState({
        relatesCount: {'some-post-id': 1337},
      });

      const {result} = renderHook(() =>
        useTogglePostRelate({id: 'some-post-id', relates: 2} as PostType),
      );

      expect(result.current.relatesCount).toBe(1337);
    });
  });

  describe('isRelating', () => {
    it('returns false when not related', async () => {
      useUserState.setState({
        user: {uid: 'user-id'} as FirebaseAuthTypes.User,
        userState: {},
      });

      const {result} = renderHook(() =>
        useTogglePostRelate({id: 'some-post-id', relates: null} as PostType),
      );

      expect(result.current.isRelating).toBe(false);
    });

    it('returns true when related', async () => {
      useUserState.setState({
        user: {uid: 'user-id'} as FirebaseAuthTypes.User,
        userState: {
          'user-id': {
            postRelates: ['some-post-id'],
          },
        },
      });

      const {result} = renderHook(() =>
        useTogglePostRelate({id: 'some-post-id', relates: null} as PostType),
      );

      expect(result.current.isRelating).toBe(true);
    });
  });

  describe('toggleRelate', () => {
    it('optimistically increases the relates count if not already toggled', async () => {
      useUserState.setState({
        user: {uid: 'user-id'} as FirebaseAuthTypes.User,
        userState: {},
      });

      const {result} = renderHook(() =>
        useTogglePostRelate({id: 'some-post-id', relates: 1336} as PostType),
      );

      await act(async () => {
        await result.current.toggleRelate();
      });

      expect(result.current.isRelating).toBe(true);
      expect(result.current.relatesCount).toBe(1337);
      expect(useUserState.getState().userState['user-id']).toEqual({
        postRelates: ['some-post-id'],
      });
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock).toHaveBeenCalledWith(
        'some-api-endpoint/posts/some-post-id/relate',
        expect.objectContaining({method: 'POST'}),
      );
    });

    it('optimistically decreases the relates count when already toggled', async () => {
      useUserState.setState({
        user: {uid: 'user-id'} as FirebaseAuthTypes.User,
        userState: {
          'user-id': {
            postRelates: ['some-post-id'],
          },
        },
      });

      const {result} = renderHook(() =>
        useTogglePostRelate({id: 'some-post-id', relates: 1338} as PostType),
      );

      await act(async () => {
        await result.current.toggleRelate();
      });

      expect(result.current.isRelating).toBe(false);
      expect(result.current.relatesCount).toBe(1337);
      expect(useUserState.getState().userState['user-id']).toEqual({
        postRelates: [],
      });
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock).toHaveBeenCalledWith(
        'some-api-endpoint/posts/some-post-id/relate',
        expect.objectContaining({method: 'DELETE'}),
      );
    });
  });
});
