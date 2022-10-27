import {act, renderHook} from '@testing-library/react-hooks';
import {RecoilRoot, useRecoilValue} from 'recoil';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import useSessions from './useSessions';
import fetchMock, {enableFetchMocks} from 'jest-fetch-mock';
import {isLoadingAtom, sessionsAtom} from '../state/state';
import {userAtom} from '../../../lib/user/state/state';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import {SessionType} from '../../../../../shared/src/types/Session';

dayjs.extend(utc);

enableFetchMocks();

afterEach(() => {
  fetchMock.resetMocks();
  jest.clearAllMocks();
});

describe('useSessions', () => {
  describe('fetchSessions', () => {
    const useTestHook = () => {
      const {fetchSessions} = useSessions();
      const sessions = useRecoilValue(sessionsAtom);
      const isLoading = useRecoilValue(isLoadingAtom);

      return {fetchSessions, sessions, isLoading};
    };

    it('should fetch sessions', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify([{id: 'session-id', url: '/session-url'}]),
        {status: 200},
      );
      const {result} = renderHook(() => useTestHook(), {
        wrapper: RecoilRoot,
        initialProps: {
          initializeState: ({set}) => {
            set(userAtom, {} as FirebaseAuthTypes.User);
          },
          children: null,
        },
      });

      await act(async () => {
        await result.current.fetchSessions();
      });

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(result.current.sessions).toEqual([
        {id: 'session-id', url: '/session-url'},
      ]);
    });

    it('should update loading state', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify([{id: 'session-id', url: '/session-url'}]),
        {status: 200},
      );
      const {result} = renderHook(() => useTestHook(), {
        wrapper: RecoilRoot,
        initialProps: {
          initializeState: ({set}) => {
            set(userAtom, {} as FirebaseAuthTypes.User);
          },
          children: null,
        },
      });

      const fetchPromise = act(async () => {
        await result.current.fetchSessions();
      });

      expect(result.current.isLoading).toEqual(true);
      await fetchPromise;
      expect(result.current.isLoading).toEqual(false);
    });
  });

  describe('addSession', () => {
    const startTime = dayjs.utc('1994-03-08');

    it('should add a session and refetch', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          id: 'session-id',
          url: '/session-url',
          name: 'Session Name',
        }),
        {status: 200},
      );
      const {result} = renderHook(() => useSessions(), {
        wrapper: RecoilRoot,
        initialProps: {
          initializeState: ({set}) => {
            set(userAtom, {} as FirebaseAuthTypes.User);
          },
          children: null,
        },
      });

      await act(async () => {
        await result.current.addSession({
          contentId: 'some-content-id',
          type: SessionType.public,
          startTime,
          language: 'en',
        });
      });

      expect(fetchMock).toHaveBeenCalledWith('some-api-endpoint/sessions', {
        body: JSON.stringify({
          contentId: 'some-content-id',
          type: 'public',
          startTime: '1994-03-08T00:00:00.000Z',
          language: 'en',
        }),
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': 'en',
          'X-Correlation-ID': expect.any(String),
        },
        method: 'POST',
      });

      expect(fetchMock).toHaveBeenCalledWith('some-api-endpoint/sessions', {
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': 'en',
          'X-Correlation-ID': expect.any(String),
        },
      });
    });
  });

  describe('deleteSession', () => {
    it('should delete a session and refetch', async () => {
      fetchMock.mockResponseOnce('Success', {status: 200});
      const {result} = renderHook(() => useSessions(), {
        wrapper: RecoilRoot,
        initialProps: {
          initializeState: ({set}) => {
            set(userAtom, {} as FirebaseAuthTypes.User);
          },
          children: null,
        },
      });

      await act(async () => {
        await result.current.deleteSession('session-id');
      });

      expect(fetchMock).toHaveBeenCalledWith(
        'some-api-endpoint/sessions/session-id',
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept-Language': 'en',
            'X-Correlation-ID': expect.any(String),
          },
          method: 'DELETE',
        },
      );

      expect(fetchMock).toHaveBeenCalledWith('some-api-endpoint/sessions', {
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': 'en',
          'X-Correlation-ID': expect.any(String),
        },
      });
    });
  });
});
