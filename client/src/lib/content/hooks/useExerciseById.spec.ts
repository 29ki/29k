import {renderHook} from '@testing-library/react-hooks';
import useExerciseById from './useExerciseById';

const mockT = jest.fn().mockReturnValue('some-exercise');
jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({
    t: mockT,
  })),
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe('useExerciseById', () => {
  it('returns a translated exercise', () => {
    const {result} = renderHook(() => useExerciseById('some-exercise-id'));

    expect(mockT).toHaveBeenCalledTimes(1);
    expect(mockT).toHaveBeenCalledWith('some-exercise-id', {
      returnObjects: true,
    });

    expect(result.current).toBe('some-exercise');
  });

  it('returns empty array when no ID is provided', () => {
    const {result} = renderHook(() => useExerciseById(undefined));

    expect(mockT).toHaveBeenCalledTimes(0);

    expect(result.current).toEqual([]);
  });

  it('memoizes the result - as i18next.t is not pure', () => {
    const {result, rerender} = renderHook(() =>
      useExerciseById('some-exercise-id'),
    );

    rerender();

    expect(mockT).toHaveBeenCalledTimes(1);
    expect(result.all.length).toEqual(2);
  });
});
