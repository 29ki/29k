import {renderHook} from '@testing-library/react-hooks';
import {act} from 'react-test-renderer';
import useGetExerciseById from './useGetExerciseById';

const mockT = jest.fn().mockReturnValue('some-exercise');
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
    const {result} = renderHook(() => useGetExerciseById());

    act(() => {
      expect(result.current('some-exercise-id')).toBe('some-exercise');
    });

    expect(mockT).toHaveBeenCalledTimes(1);
    expect(mockT).toHaveBeenCalledWith('some-exercise-id', {
      returnObjects: true,
    });
  });
});
