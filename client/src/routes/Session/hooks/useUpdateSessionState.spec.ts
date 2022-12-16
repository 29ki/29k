import {act, renderHook} from '@testing-library/react-hooks';

import useUpdateSessionState from './useUpdateSessionState';
import fetchMock, {enableFetchMocks} from 'jest-fetch-mock';
import {ExerciseSlide} from '../../../../../shared/src/types/Content';

enableFetchMocks();

const mockContent = [
  {type: 'participantSpotlight'},
  {type: 'content', content: {heading: 'some heading'}},
  {
    type: 'reflection',
    content: {
      heading: 'some heading',
      video: {source: 'some://source', preview: 'some://preview'},
    },
  },
] as ExerciseSlide[];

beforeEach(() => {
  fetchMock.resetMocks();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('useUpdateSessionState', () => {
  const useTestHook = (sessionId?: string) => {
    const {navigateToIndex, setPlaying, setSpotlightParticipant} =
      useUpdateSessionState(sessionId);

    return {navigateToIndex, setPlaying, setSpotlightParticipant};
  };

  describe('setSpotlightParticipant', () => {
    it('should call api when called', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          data: 'some-data',
        }),
        {status: 200},
      );

      const {result} = renderHook(() => useTestHook('session-id'));

      await act(async () => {
        await result.current.setSpotlightParticipant('some-participant-id');
      });

      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('should do nothing when session is undefined', async () => {
      const {result} = renderHook(() => useTestHook());

      await act(async () => {
        await result.current.setSpotlightParticipant('some-participant-id');
      });

      expect(fetchMock).toHaveBeenCalledTimes(0);
    });
  });

  describe('setPlaying', () => {
    it('should call api when called', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          data: 'some-data',
        }),
        {status: 200},
      );

      const {result} = renderHook(() => useTestHook('session-id'));

      await act(async () => {
        await result.current.setPlaying(true);
      });

      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('should do nothing when session is undefined', async () => {
      const {result} = renderHook(() => useTestHook());

      await act(async () => {
        await result.current.setPlaying(true);
      });

      expect(fetchMock).toHaveBeenCalledTimes(0);
    });
  });

  describe('navigateToIndex', () => {
    it('should make request', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          data: 'some-data',
        }),
        {status: 200},
      );

      const {result} = renderHook(() => useTestHook('session-id'));

      await act(async () => {
        await result.current.navigateToIndex({index: 2, content: mockContent});
      });

      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('should do nothing when session is undefined', async () => {
      const {result} = renderHook(() => useTestHook());

      await act(async () => {
        await result.current.navigateToIndex({index: 4, content: mockContent});
      });

      expect(fetchMock).toHaveBeenCalledTimes(0);
    });

    it('should do nothing when session isnt fetched', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          yolo: '123',
        }),
        {status: 200},
      );

      const {result} = renderHook(() => useTestHook('session-id'));

      await act(async () => {
        await result.current.navigateToIndex({index: 4, content: mockContent});
      });

      expect(fetchMock).toHaveBeenCalledTimes(0);
    });

    it('should do nothing when index is invalid', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          yolo: '123',
        }),
        {status: 200},
      );

      const {result} = renderHook(() => useTestHook('session-id'));

      await act(async () => {
        const invalidIndex = 4000;
        const invalidIndex2 = -1;
        await result.current.navigateToIndex({
          index: invalidIndex,
          content: mockContent,
        });
        await result.current.navigateToIndex({
          index: invalidIndex2,
          content: mockContent,
        });
      });

      expect(fetchMock).toHaveBeenCalledTimes(0);
    });
  });
});
