import {renderHook} from '@testing-library/react-hooks';
import {SessionMode} from '../../../../../shared/src/schemas/Session';
import useGetExercisesByMode from './useGetExercisesByMode';

const mockUseExercises = jest.fn().mockReturnValue([
  {id: 'some-exercise-id', live: true},
  {
    id: 'some-async-exercise-id',
    live: true,
    async: true,
  },
]);
jest.mock('./useExercises', () => () => mockUseExercises());

afterEach(() => {
  jest.clearAllMocks();
});

describe('useGetExercisesByMode', () => {
  it('returns async enabled translated exercises', () => {
    const {result} = renderHook(() => useGetExercisesByMode(SessionMode.async));

    expect(mockUseExercises).toHaveBeenCalledTimes(1);

    expect(result.current).toEqual([
      {id: 'some-async-exercise-id', live: true, async: true},
    ]);
  });

  it('returns only live enabled translated exercises', () => {
    const {result} = renderHook(() => useGetExercisesByMode(SessionMode.live));

    expect(result.current).toEqual([
      {id: 'some-exercise-id', live: true},
      {async: true, id: 'some-async-exercise-id', live: true},
    ]);
  });
});
