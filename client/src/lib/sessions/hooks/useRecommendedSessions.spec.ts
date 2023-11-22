import {renderHook} from '@testing-library/react-hooks';
import useRecommendedSessions from './useRecommendedSessions';
import useSessions from './useSessions';
import usePinnedCollections from '../../user/hooks/usePinnedCollections';
import useExercises from '../../content/hooks/useExercises';
import dayjs from 'dayjs';

jest.mock('./useSessions');
const mockUseSessions = useSessions as jest.Mock;
mockUseSessions.mockReturnValue({
  pinnedSessions: [],
  hostedSessions: [],
});

jest.mock('../../user/hooks/usePinnedCollections');
const mockUsePinnedCollections = usePinnedCollections as jest.Mock;
mockUsePinnedCollections.mockReturnValue({
  pinnedCollections: [],
});

const mockGetExercisesByCollectionId = jest.fn();
jest.mock(
  '../../content/hooks/useGetExercisesByCollectionId',
  () => () => mockGetExercisesByCollectionId,
);

const mockGetCompletedSessionByExerciseId = jest.fn();
jest.mock('../../user/hooks/useCompletedSessionByTime', () => () => ({
  getCompletedSessionByExerciseId: mockGetCompletedSessionByExerciseId,
}));

jest.mock('../../content/hooks/useExercises');
const mockUseExercises = useExercises as jest.Mock;
mockUseExercises.mockReturnValue([]);

afterEach(jest.clearAllMocks);

describe('useRecommendedSessions', () => {
  describe('pinned sessions', () => {
    it('returns all pinned sessions', () => {
      mockUseSessions.mockReturnValueOnce({
        pinnedSessions: [{id: 'some-pinned-session-id'}],
        hostedSessions: [],
      });

      const {result} = renderHook(() => useRecommendedSessions());

      expect(mockUseSessions).toHaveBeenCalledTimes(1);
      expect(result.current).toEqual([{id: 'some-pinned-session-id'}]);
    });

    it('returns todays session first', () => {
      const startTime = dayjs().toISOString();

      mockUseSessions.mockReturnValueOnce({
        pinnedSessions: [{id: 'some-pinned-session-today-id', startTime}],
        hostedSessions: [],
      });
      mockUseExercises.mockReturnValueOnce([{id: 'some-exercise-id'}]);

      const {result} = renderHook(() => useRecommendedSessions());

      expect(mockUseSessions).toHaveBeenCalledTimes(1);
      expect(result.current).toEqual([
        {
          id: 'some-pinned-session-today-id',
          startTime,
        },
        {id: 'some-exercise-id'},
      ]);
    });

    it('returns future sessions last', () => {
      const startTime = dayjs().add(1, 'day').toISOString();

      mockUseSessions.mockReturnValueOnce({
        pinnedSessions: [{id: 'some-pinned-session-today-id', startTime}],
        hostedSessions: [],
      });
      mockUseExercises.mockReturnValueOnce([{id: 'some-exercise-id'}]);

      const {result} = renderHook(() => useRecommendedSessions());

      expect(mockUseSessions).toHaveBeenCalledTimes(1);
      expect(result.current).toEqual([
        {id: 'some-exercise-id'},
        {
          id: 'some-pinned-session-today-id',
          startTime,
        },
      ]);
    });
  });

  describe('hosted sessions', () => {
    it('returns all hosted sessions', () => {
      mockUseSessions.mockReturnValueOnce({
        pinnedSessions: [],
        hostedSessions: [{id: 'some-hosted-session-id'}],
      });

      const {result} = renderHook(() => useRecommendedSessions());

      expect(mockUseSessions).toHaveBeenCalledTimes(1);
      expect(result.current).toEqual([{id: 'some-hosted-session-id'}]);
    });

    it('returns todays session first', () => {
      const startTime = dayjs().toISOString();

      mockUseSessions.mockReturnValueOnce({
        pinnedSessions: [],
        hostedSessions: [{id: 'some-hosted-session-today-id', startTime}],
      });
      mockUseExercises.mockReturnValueOnce([{id: 'some-exercise-id'}]);

      const {result} = renderHook(() => useRecommendedSessions());

      expect(mockUseSessions).toHaveBeenCalledTimes(1);
      expect(result.current).toEqual([
        {
          id: 'some-hosted-session-today-id',
          startTime,
        },
        {id: 'some-exercise-id'},
      ]);
    });

    it('returns future sessions last', () => {
      const startTime = dayjs().add(1, 'day').toISOString();

      mockUseSessions.mockReturnValueOnce({
        pinnedSessions: [],
        hostedSessions: [{id: 'some-hosted-session-today-id', startTime}],
      });
      mockUseExercises.mockReturnValueOnce([{id: 'some-exercise-id'}]);

      const {result} = renderHook(() => useRecommendedSessions());

      expect(mockUseSessions).toHaveBeenCalledTimes(1);
      expect(result.current).toEqual([
        {id: 'some-exercise-id'},
        {
          id: 'some-hosted-session-today-id',
          startTime,
        },
      ]);
    });
  });

  describe('pinned collections', () => {
    it('returns all pinned collection exercises', () => {
      mockUsePinnedCollections.mockReturnValueOnce({
        pinnedCollections: [{id: 'some-pinned-collection-id'}],
      });
      mockGetExercisesByCollectionId.mockReturnValueOnce([
        {id: 'some-exercise-id'},
        {id: 'some-other-exercise-id'},
      ]);

      const {result} = renderHook(() => useRecommendedSessions());

      expect(mockUsePinnedCollections).toHaveBeenCalledTimes(1);
      expect(mockGetExercisesByCollectionId).toHaveBeenCalledTimes(1);
      expect(mockGetExercisesByCollectionId).toHaveBeenCalledWith(
        'some-pinned-collection-id',
      );
      expect(result.current).toEqual([
        {id: 'some-exercise-id'},
        {id: 'some-other-exercise-id'},
      ]);
    });

    it('returns collection exercises that are incomplete', () => {
      mockUsePinnedCollections.mockReturnValueOnce({
        pinnedCollections: [
          {id: 'some-pinned-collection-id', startedAt: 'some-timestamp'},
        ],
      });
      mockGetExercisesByCollectionId.mockReturnValueOnce([
        {id: 'some-completed-exercise-id'},
        {id: 'some-exercise-id'},
      ]);
      mockGetCompletedSessionByExerciseId
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(false);

      const {result} = renderHook(() => useRecommendedSessions());

      expect(mockUsePinnedCollections).toHaveBeenCalledTimes(1);
      expect(mockGetExercisesByCollectionId).toHaveBeenCalledTimes(1);
      expect(mockGetExercisesByCollectionId).toHaveBeenCalledWith(
        'some-pinned-collection-id',
      );
      expect(mockGetCompletedSessionByExerciseId).toHaveBeenCalledTimes(2);
      expect(mockGetCompletedSessionByExerciseId).toHaveBeenCalledWith(
        'some-completed-exercise-id',
        'some-timestamp',
      );
      expect(mockGetCompletedSessionByExerciseId).toHaveBeenCalledWith(
        'some-exercise-id',
        'some-timestamp',
      );
      expect(result.current).toEqual([{id: 'some-exercise-id'}]);
    });

    it('returns 5 random exercises if no pinned collections', () => {
      mockUsePinnedCollections.mockReturnValueOnce({
        pinnedCollections: [],
      });
      mockUseExercises.mockReturnValueOnce([
        {id: 'some-exercise-id-1'},
        {id: 'some-exercise-id-2'},
        {id: 'some-exercise-id-3'},
        {id: 'some-exercise-id-4'},
        {id: 'some-exercise-id-5'},
        {id: 'some-exercise-id-6'},
        {id: 'some-exercise-id-7'},
      ]);

      const {result} = renderHook(() => useRecommendedSessions());

      expect(mockUseExercises).toHaveBeenCalledTimes(1);
      expect(result.current.length).toBe(5);
      expect(result.current).toEqual([
        {id: expect.stringContaining('some-exercise-id')},
        {id: expect.stringContaining('some-exercise-id')},
        {id: expect.stringContaining('some-exercise-id')},
        {id: expect.stringContaining('some-exercise-id')},
        {id: expect.stringContaining('some-exercise-id')},
      ]);
    });
  });

  describe('combined', () => {
    it('returns unique sessions', () => {
      const someSession = {id: 'some-session-id'};
      const someOtherSession = {id: 'some-other-session-id'};

      mockUseSessions.mockReturnValueOnce({
        pinnedSessions: [someSession],
        hostedSessions: [someSession, someOtherSession],
      });

      const {result} = renderHook(() => useRecommendedSessions());

      expect(result.current).toEqual([
        {id: 'some-session-id'},
        {id: 'some-other-session-id'},
      ]);
    });

    it('returns sessions combined with pinned collections', () => {
      const today = dayjs().toISOString();
      const tomorrow = dayjs().add(1, 'day').toISOString();

      mockUseSessions.mockReturnValueOnce({
        pinnedSessions: [
          {id: 'some-pinned-session-today-id', startTime: today},
          {id: 'some-pinned-session-tomorrow-id', startTime: tomorrow},
        ],
        hostedSessions: [
          {id: 'some-hosted-session-today-id', startTime: today},
          {id: 'some-hosted-session-tomorrow-id', startTime: tomorrow},
        ],
      });

      mockUsePinnedCollections.mockReturnValueOnce({
        pinnedCollections: [{id: 'some-pinned-collection-id'}],
      });
      mockGetExercisesByCollectionId.mockReturnValueOnce([
        {id: 'some-exercise-id'},
        {id: 'some-other-exercise-id'},
      ]);

      const {result} = renderHook(() => useRecommendedSessions());

      expect(result.current).toEqual([
        {id: 'some-pinned-session-today-id', startTime: today},
        {id: 'some-hosted-session-today-id', startTime: today},
        {id: 'some-exercise-id'},
        {id: 'some-other-exercise-id'},
        {id: 'some-pinned-session-tomorrow-id', startTime: tomorrow},
        {id: 'some-hosted-session-tomorrow-id', startTime: tomorrow},
      ]);
    });

    it('returns sessions combined with random exercises', () => {
      const today = dayjs().toISOString();
      const tomorrow = dayjs().add(1, 'day').toISOString();

      mockUseSessions.mockReturnValueOnce({
        pinnedSessions: [
          {id: 'some-pinned-session-today-id', startTime: today},
          {id: 'some-pinned-session-tomorrow-id', startTime: tomorrow},
        ],
        hostedSessions: [
          {id: 'some-hosted-session-today-id', startTime: today},
          {id: 'some-hosted-session-tomorrow-id', startTime: tomorrow},
        ],
      });

      mockUsePinnedCollections.mockReturnValueOnce({
        pinnedCollections: [],
      });

      mockUseExercises.mockReturnValueOnce([
        {id: 'some-exercise-id-1'},
        {id: 'some-exercise-id-2'},
      ]);

      const {result} = renderHook(() => useRecommendedSessions());

      expect(result.current).toEqual([
        {id: 'some-pinned-session-today-id', startTime: today},
        {id: 'some-hosted-session-today-id', startTime: today},
        {id: expect.stringContaining('some-exercise-id')},
        {id: expect.stringContaining('some-exercise-id')},
        {id: 'some-pinned-session-tomorrow-id', startTime: tomorrow},
        {id: 'some-hosted-session-tomorrow-id', startTime: tomorrow},
      ]);
    });
  });
});
