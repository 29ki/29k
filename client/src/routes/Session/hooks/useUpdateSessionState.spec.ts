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
  describe('setPlaying', () => {
    it('should call api when called', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          data: 'some-data',
        }),
        {status: 200},
      );

      const {result} = renderHook(() => useUpdateSessionState('session-id'));

      await act(async () => {
        await result.current.setPlaying(true);
      });

      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('should do nothing when session is undefined', async () => {
      const {result} = renderHook(() => useUpdateSessionState(undefined));

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

      const {result} = renderHook(() => useUpdateSessionState('session-id'));

      await act(async () => {
        await result.current.navigateToIndex({index: 1, content: mockContent});
      });

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock).toHaveBeenCalledWith(
        'some-api-endpoint/sessions/session-id/state',
        expect.objectContaining({
          body: '{"index":1,"playing":false}',
        }),
      );
    });

    it('sets completed=true when navigating to last index', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          data: 'some-data',
        }),
        {status: 200},
      );

      const {result} = renderHook(() => useUpdateSessionState('session-id'));

      await act(async () => {
        await result.current.navigateToIndex({index: 2, content: mockContent});
      });

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock).toHaveBeenCalledWith(
        'some-api-endpoint/sessions/session-id/state',
        expect.objectContaining({
          body: '{"index":2,"playing":false,"completed":true}',
        }),
      );
    });

    it('should do nothing when session is undefined', async () => {
      const {result} = renderHook(() => useUpdateSessionState(undefined));

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

      const {result} = renderHook(() => useUpdateSessionState('session-id'));

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

      const {result} = renderHook(() => useUpdateSessionState('session-id'));

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
