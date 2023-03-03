import {act, renderHook} from '@testing-library/react-hooks';
import useSessions from './useSessions';
import fetchMock, {enableFetchMocks} from 'jest-fetch-mock';
import useSessionsState from '../state/state';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import {SessionType} from '../../../../../shared/src/types/Session';
import useUserState from '../../user/state/state';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';

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
      const sessions = useSessionsState(state => state.sessions);
      const isLoading = useSessionsState(state => state.isLoading);

      return {fetchSessions, sessions, isLoading};
    };

    it('should fetch sessions', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify([{id: 'session-id', url: '/session-url'}]),
        {status: 200},
      );
      const {result} = renderHook(() => useTestHook());

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
      const {result} = renderHook(() => useTestHook());

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

    it('should resolve to a new session and trigger a refetch', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          id: 'session-id',
          url: '/session-url',
          name: 'A New Session',
        }),
        {status: 200},
      );
      const {result} = renderHook(() => useSessions());

      await act(async () => {
        const session = await result.current.addSession({
          exerciseId: 'some-exercise-id',
          type: SessionType.public,
          startTime,
          language: 'en',
        });

        expect(session).toEqual({
          id: 'session-id',
          name: 'A New Session',
          url: '/session-url',
        });
      });

      expect(fetchMock).toHaveBeenCalledWith('some-api-endpoint/sessions', {
        body: JSON.stringify({
          exerciseId: 'some-exercise-id',
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
      const {result} = renderHook(() => useSessions());

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

  describe('sessions', () => {
    beforeEach(() => {
      fetchMock.mockResponseOnce(
        JSON.stringify([{id: 'session-id-1'}, {id: 'session-id-2'}]),
        {status: 200},
      );
    });

    it('should return sessions that are not pinned and not hosted by user', async () => {
      useUserState.setState({
        user: {uid: 'user-id'} as FirebaseAuthTypes.User,
        userState: {
          'user-id': {
            pinnedSessions: [
              {id: 'session-id-1', expires: new Date('2022-12-20')},
            ],
          },
        },
      });

      const {result} = renderHook(() => useSessions());

      await act(async () => {
        await result.current.fetchSessions();
      });

      expect(result.current.sessions).toEqual([{id: 'session-id-2'}]);
    });

    it('should return sessions not hosted by user when no session is pinned', async () => {
      useUserState.setState({
        user: {uid: 'user-id'} as FirebaseAuthTypes.User,
        userState: {},
      });

      const {result} = renderHook(() => useSessions());

      await act(async () => {
        await result.current.fetchSessions();
      });

      expect(result.current.sessions).toEqual([
        {id: 'session-id-1'},
        {id: 'session-id-2'},
      ]);
    });
  });

  describe('pinnedSessions', () => {
    beforeEach(() => {
      fetchMock.mockResponseOnce(
        JSON.stringify([{id: 'session-id-1'}, {id: 'session-id-2'}]),
        {status: 200},
      );
    });

    it('should return pinned sessions not hosted by user', async () => {
      useUserState.setState({
        user: {uid: 'user-id'} as FirebaseAuthTypes.User,
        userState: {
          'user-id': {
            pinnedSessions: [
              {id: 'session-id-1', expires: new Date('2022-12-20')},
            ],
          },
        },
      });

      const {result} = renderHook(() => useSessions());

      await act(async () => {
        await result.current.fetchSessions();
      });

      expect(result.current.pinnedSessions).toEqual([{id: 'session-id-1'}]);
    });
  });

  describe('hostedSessions', () => {
    beforeEach(() => {
      fetchMock.mockResponseOnce(
        JSON.stringify([
          {id: 'session-id-1'},
          {id: 'session-id-2'},
          {id: 'session-id-3', hostId: 'user-id'},
          {id: 'session-id-4', hostId: 'user-id'},
        ]),
        {status: 200},
      );
    });

    it('should return sessions hosted by user', async () => {
      useUserState.setState({
        user: {uid: 'user-id'} as FirebaseAuthTypes.User,
        userState: {},
      });

      const {result} = renderHook(() => useSessions());

      await act(async () => {
        await result.current.fetchSessions();
      });

      expect(result.current.hostedSessions).toEqual([
        {id: 'session-id-3', hostId: 'user-id'},
        {id: 'session-id-4', hostId: 'user-id'},
      ]);
    });
  });
});
