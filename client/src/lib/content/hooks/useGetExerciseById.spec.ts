import {renderHook} from '@testing-library/react-hooks';

import useGetExerciseById from './useGetExerciseById';

const mockT = jest.fn().mockImplementation(id => {
  if (id === 'published-exercise-id') {
    return {id: 'published-exercise-id', published: true};
  } else {
    return {id, published: false};
  }
});

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({
    t: mockT,
  })),
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe('useGetExerciseById', () => {
  it('returns a translated exercise', () => {
    const {result} = renderHook(() => {
      const getExerciseById = useGetExerciseById();
      return getExerciseById('published-exercise-id');
    });

    expect(mockT).toHaveBeenCalledTimes(1);
    expect(mockT).toHaveBeenCalledWith('published-exercise-id', {
      returnObjects: true,
    });

    expect(result.current).toEqual({
      id: 'published-exercise-id',
      published: true,
    });
  });

  it('returns null when no ID is provided', () => {
    const {result} = renderHook(() => {
      const getExerciseById = useGetExerciseById();
      return getExerciseById(undefined);
    });

    expect(mockT).toHaveBeenCalledTimes(0);

    expect(result.current).toBe(null);
  });

  it('returns null when no published is false', () => {
    const {result} = renderHook(() => {
      const getExerciseById = useGetExerciseById();
      return getExerciseById('not-published-exercise-id');
    });

    expect(mockT).toHaveBeenCalledTimes(1);
    expect(mockT).toHaveBeenCalledWith('not-published-exercise-id', {
      returnObjects: true,
    });

    expect(result.current).toBe(null);
  });
});
