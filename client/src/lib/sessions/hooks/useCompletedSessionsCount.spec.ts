import {act, renderHook} from '@testing-library/react-hooks';
import fetchMock, {enableFetchMocks} from 'jest-fetch-mock';
import {Collection} from '../../../../../shared/src/types/generated/Collection';
import useSessionsState from '../state/state';
import useCompletedSessionsCount from './useCompletedSessionsCount';

enableFetchMocks();

afterEach(() => {
  fetchMock.resetMocks();
  jest.clearAllMocks();
});

describe('useCompletedSessionsCount', () => {
  const useTestHook = () => {
    const {
      getCompletedSessionsCountByCollection,
      getCompletedSessionsCountByExerciseId,
    } = useCompletedSessionsCount();

    return {
      getCompletedSessionsCountByCollection,
      getCompletedSessionsCountByExerciseId,
    };
  };

  it('should load completed sessions count', async () => {
    useSessionsState.setState({
      completedSessionsCount: null,
    });
    fetchMock.mockResponseOnce(
      JSON.stringify([{exerciseId: 'some-exercise-id', publicCount: 1}]),
      {status: 200},
    );

    await act(async () => {
      renderHook(() => useTestHook());
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  describe('getCompletedSessionsCountByExerciseId', () => {
    it('should sum the counts for an exercise', async () => {
      useSessionsState.setState({
        completedSessionsCount: [
          {
            exerciseId: 'some-exercise-id',
            asyncCount: 0,
            privateCount: 1,
            publicCount: 2,
          },
          {
            exerciseId: 'some-other-exercise-id',
            asyncCount: 0,
            privateCount: 1,
            publicCount: 2,
          },
        ],
      });

      const {result} = renderHook(() => useTestHook());

      expect(
        result.current.getCompletedSessionsCountByExerciseId(
          'some-exercise-id',
        ),
      ).toEqual(3);
    });
  });

  describe('getCompletedSessionsCountByCollection', () => {
    it('should sum the counts for a collection', async () => {
      useSessionsState.setState({
        completedSessionsCount: [
          {
            exerciseId: 'some-exercise-id',
            asyncCount: 0,
            privateCount: 1,
            publicCount: 2,
          },
          {
            exerciseId: 'some-other-exercise-id',
            asyncCount: 0,
            privateCount: 1,
            publicCount: 2,
          },
          {
            exerciseId: 'some-third-exercise-id',
            asyncCount: 0,
            privateCount: 1,
            publicCount: 2,
          },
        ],
      });

      const {result} = renderHook(() => useTestHook());

      expect(
        result.current.getCompletedSessionsCountByCollection({
          exercises: ['some-exercise-id', 'some-other-exercise-id'],
        } as Collection),
      ).toEqual(6);
    });
  });
});
