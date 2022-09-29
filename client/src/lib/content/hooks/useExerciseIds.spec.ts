import {renderHook} from '@testing-library/react-hooks';
import useExerciseIds from './useExerciseIds';

const mockT = jest
  .fn()
  .mockReturnValue(['some-exercise-id', 'some-other-exercise-id']);
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
    const {result} = renderHook(() => useExerciseIds());

    expect(mockT).toHaveBeenCalledTimes(1);
    expect(mockT).toHaveBeenCalledWith('exercises', {
      returnObjects: true,
    });

    expect(result.current).toEqual([
      'some-exercise-id',
      'some-other-exercise-id',
    ]);
  });

  it('memoizes the result - as i18next.t is not pure', () => {
    const {result, rerender} = renderHook(() => useExerciseIds());

    rerender();

    expect(mockT).toHaveBeenCalledTimes(1);
    expect(result.all.length).toEqual(2);
  });
});
